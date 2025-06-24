// Test script to verify Prompto extension functionality
console.log('Prompto Test: Extension test started');

// Test 1: Check if extension is loaded
if (window.__PROMPTO_LOADED) {
  console.log('Prompto Test: Extension loaded successfully');
} else {
  console.log('Prompto Test: Extension not loaded');
}

// Test 2: Check if FAB is mounted
setTimeout(() => {
  const fab = document.querySelector('.prompto-fab');
  if (fab) {
    console.log('Prompto Test: FAB button found');
    console.log('Prompto Test: FAB button type:', fab.type);
    console.log('Prompto Test: FAB button classes:', fab.className);
  } else {
    console.log('Prompto Test: FAB button not found');
  }
  
  // Test 3: Check if textarea is detected
  const textarea = document.querySelector('textarea[placeholder*="Message"], textarea[data-id="root"], #prompt-textarea');
  if (textarea) {
    console.log('Prompto Test: Textarea found');
    console.log('Prompto Test: Textarea type:', textarea.tagName);
  } else {
    console.log('Prompto Test: Textarea not found');
  }
}, 2000);

// Test 4: Simulate button click (without actual enhancement)
setTimeout(() => {
  const childButtons = document.querySelectorAll('.prompto-child');
  console.log('Prompto Test: Child buttons found:', childButtons.length);
  
  childButtons.forEach((btn, index) => {
    console.log(`Prompto Test: Child button ${index} type:`, btn.type);
    console.log(`Prompto Test: Child button ${index} title:`, btn.title);
  });
}, 5000); 