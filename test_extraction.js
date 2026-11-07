import assert from 'node:assert';
import { parseDocumentText, mergeExtractedFields } from './src/services/documentParser.js';
import { SAMPLE_DOCUMENTS } from './src/services/sampleDocs.js';
import { evaluateEligibility } from './src/services/ruleEngine.js';

console.log("=== RUNNING DOCUMENT EXTRACTION & PROFILE VERIFICATION TESTS ===");

// 1. Initial Empty Citizen Profile
let citizen = {
  name: 'Initial User',
  age: 40,
  gender: 'Male',
  income: 150000,
  caste: 'General',
  state: 'Maharashtra',
  occupation: 'Salaried',
  uploadedDocs: []
};

// 2. Test Aadhaar Extraction & Merging
const aadhaarSample = SAMPLE_DOCUMENTS.aadhaar[0]; // Ramesh Tukaram Patil (Maharashtra, age 42, Male)
const parsedAadhaar = parseDocumentText('aadhaar', aadhaarSample.rawText);
assert.strictEqual(parsedAadhaar.docType, 'aadhaar');
assert.strictEqual(parsedAadhaar.fields.name, 'Ramesh Tukaram Patil');
assert.strictEqual(parsedAadhaar.fields.gender, 'Male');
assert.strictEqual(parsedAadhaar.fields.state, 'Maharashtra');
assert.strictEqual(parsedAadhaar.fields.aadhaarLast4, '3847');
console.log("✅ Aadhaar Extraction Passed: Name, Gender, State, AadhaarLast4 correctly parsed.");

citizen = mergeExtractedFields(citizen, parsedAadhaar);
citizen.uploadedDocs.push('aadhaar');
assert.strictEqual(citizen.name, 'Ramesh Tukaram Patil');
assert.strictEqual(citizen.aadhaarLast4, '3847');
console.log("✅ Aadhaar Merged into Profile successfully.");

// 3. Test Income Certificate Extraction & Merging
const incomeSample = SAMPLE_DOCUMENTS.income[0]; // Tahsildar Haveli, Rs. 65,000/-
const parsedIncome = parseDocumentText('income', incomeSample.rawText);
assert.strictEqual(parsedIncome.docType, 'income');
assert.strictEqual(parsedIncome.fields.income, 65000);
console.log("✅ Income Certificate Extraction Passed: ₹65,000 parsed cleanly without confusing with pincode/application number.");

citizen = mergeExtractedFields(citizen, parsedIncome);
citizen.uploadedDocs.push('income');
assert.strictEqual(citizen.income, 65000);
console.log("✅ Income Merged into Profile successfully.");

// 4. Test Ration Card Extraction & Merging
const rationSample = SAMPLE_DOCUMENTS.ration[0]; // BPL Ration Card
const parsedRation = parseDocumentText('ration', rationSample.rawText);
assert.strictEqual(parsedRation.docType, 'ration');
assert.strictEqual(parsedRation.fields.rationCardType, 'BPL');
console.log("✅ Ration Card Extraction Passed: BPL category identified.");

citizen = mergeExtractedFields(citizen, parsedRation);
citizen.uploadedDocs.push('ration');
assert.strictEqual(citizen.rationCardType, 'BPL');
console.log("✅ Ration Card Merged into Profile successfully.");

// 5. Test Caste Certificate Extraction & Merging
const casteSample = SAMPLE_DOCUMENTS.caste[0]; // OBC Caste Certificate
const parsedCaste = parseDocumentText('caste', casteSample.rawText);
assert.strictEqual(parsedCaste.docType, 'caste');
assert.strictEqual(parsedCaste.fields.caste, 'OBC');
console.log("✅ Caste Certificate Extraction Passed: OBC category identified.");

citizen = mergeExtractedFields(citizen, parsedCaste);
citizen.uploadedDocs.push('caste');
assert.strictEqual(citizen.caste, 'OBC');
console.log("✅ Caste Merged into Profile successfully.");

// 6. Test Land Record Extraction & Merging
const landSample = SAMPLE_DOCUMENTS.land[0]; // 2.50 Acres
const parsedLand = parseDocumentText('land', landSample.rawText);
assert.strictEqual(parsedLand.docType, 'land');
assert.strictEqual(parsedLand.fields.landAcres, 2.5);
assert.strictEqual(parsedLand.fields.occupation, 'Farmer');
console.log("✅ Land Record Extraction Passed: 2.5 Acres and Farmer occupation identified.");

citizen = mergeExtractedFields(citizen, parsedLand);
citizen.uploadedDocs.push('land');
assert.strictEqual(citizen.landAcres, 2.5);
assert.strictEqual(citizen.occupation, 'Farmer');
console.log("✅ Land Record Merged into Profile successfully.");

// 7. Test Form Modification & Eligibility Recalculation
console.log("\n--- Testing Form Review & Recalculate Flow ---");
// Initial eligibility calculation
const initialEval = evaluateEligibility(citizen);
console.log(`Citizen evaluated: ${initialEval.totalEligibleCount} eligible schemes found (Total benefit: ₹${initialEval.totalBenefitAmount.toLocaleString('en-IN')})`);
assert.ok(initialEval.totalEligibleCount > 0, "Should have eligible schemes");

// Now simulate user modifying profile in ProfileVerificationForm (e.g. changing occupation to Student, age to 21, income to 40000)
const modifiedCitizen = {
  ...citizen,
  age: 21,
  occupation: 'Student',
  isStudent: true,
  income: 40000,
  educationLevel: 'Undergraduate'
};
const reEval = evaluateEligibility(modifiedCitizen);
console.log(`After modifying profile to 21-yr student: ${reEval.totalEligibleCount} eligible schemes found`);
assert.ok(reEval.totalEligibleCount > 0);

// Check that student schemes are now present or evaluated
const studentOrYouthSchemes = reEval.eligibleSchemes.filter(s => 
  s.category === 'Education & Learning' || 
  s.category === 'Skills & Employment' ||
  s.targetBeneficiaries?.some(b => b.toLowerCase().includes('student'))
);
console.log(`Eligible Student/Youth Schemes: ${studentOrYouthSchemes.length}`);

console.log("\n🎉 ALL DOCUMENT EXTRACTION & PROFILE VERIFICATION TESTS PASSED SUCCESSFULLY!");
