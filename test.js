import { DoubtManager, DoubtsUI } from './dist/index.js';

// Test the DoubtManager
console.log('Testing DoubtManager...');

const manager = new DoubtManager({
  defaultActor: { name: "Test Scholar", sameAs: ["https://example.org/test"] }
});

// Create a doubt
const doubt = manager.createDoubt(
  "test-claim-1", 
  "How can we verify this claim without additional evidence?"
);

console.log('Created doubt:', doubt);

// Get doubts about the claim
const doubts = manager.getDoubtsAbout("test-claim-1");
console.log('Doubts about test-claim-1:', doubts);

// Test subscription
manager.subscribe((allDoubts) => {
  console.log('Doubt subscription triggered. Total doubts:', allDoubts.length);
});

// Create another doubt to trigger subscription
manager.createDoubt("test-claim-1", "What about the dating methodology?");

console.log('All tests passed! ✅');

// Export for potential use in HTML
window.DoubtManager = DoubtManager;
window.DoubtsUI = DoubtsUI;