import { evaluateEligibility } from './src/services/ruleEngine.js';
import { INITIAL_CITIZENS } from './src/services/sampleDocs.js';

console.log("=== TESTING ELIGIBILITY RULE ENGINE ===");

INITIAL_CITIZENS.forEach(citizen => {
  console.log(`\n-----------------------------------------`);
  console.log(`Evaluating Citizen: ${citizen.name} (${citizen.state}, Age: ${citizen.age}, Gender: ${citizen.gender}, Income: ₹${citizen.income.toLocaleString()})`);
  
  const result = evaluateEligibility(citizen);
  console.log(`✅ Eligible Schemes (${result.totalEligibleCount}):`);
  result.eligibleSchemes.forEach(s => {
    console.log(`  - [${s.shortName}] (Benefit: ${s.benefitDisplay})`);
  });

  console.log(`❌ Ineligible Schemes (${result.totalIneligibleCount}):`);
  result.ineligibleSchemes.slice(0, 5).forEach(s => {
    console.log(`  - [${s.shortName}] Reason: ${s.failureReasons[0]}`);
  });
  console.log(`💰 Total Calculated Monetary Potential: ₹${result.totalBenefitAmount.toLocaleString('en-IN')}`);
});
