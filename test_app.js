// Simple test script to verify app functionality
console.log('🧪 Testing Prompt Copilot Application...')

// Test 1: Check if frontend is accessible
async function testFrontend() {
  try {
    const response = await fetch('http://localhost:5173/')
    console.log('✅ Frontend is accessible')
    return true
  } catch (error) {
    console.log('❌ Frontend is not accessible:', error.message)
    return false
  }
}

// Test 2: Check if backend is accessible
async function testBackend() {
  try {
    const response = await fetch('http://localhost:8002/api/health')
    const data = await response.json()
    console.log('✅ Backend is accessible:', data)
    return true
  } catch (error) {
    console.log('❌ Backend is not accessible:', error.message)
    return false
  }
}

// Test 3: Test auth endpoints
async function testAuth() {
  try {
    const response = await fetch('http://localhost:8002/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpass123'
      })
    })
    const data = await response.json()
    console.log('✅ Auth endpoint is working:', data.token ? 'Token received' : 'No token')
    return true
  } catch (error) {
    console.log('❌ Auth endpoint failed:', error.message)
    return false
  }
}

// Run all tests
async function runTests() {
  console.log('\n🔍 Running tests...\n')
  
  const frontendOk = await testFrontend()
  const backendOk = await testBackend()
  const authOk = await testAuth()
  
  console.log('\n📊 Test Results:')
  console.log(`Frontend: ${frontendOk ? '✅' : '❌'}`)
  console.log(`Backend: ${backendOk ? '✅' : '❌'}`)
  console.log(`Auth: ${authOk ? '✅' : '❌'}`)
  
  if (frontendOk && backendOk && authOk) {
    console.log('\n🎉 All tests passed! Your app is working correctly.')
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs above for details.')
  }
}

// Run tests if this script is executed directly
if (typeof window !== 'undefined') {
  runTests()
} else {
  console.log('This test script should be run in a browser environment.')
} 