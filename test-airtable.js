// Test script to verify Airtable connection and data
import { airtableService } from './services/airtableService.js';

async function testAirtable() {
  console.log('🔍 Testing Airtable connection...\n');

  try {
    // Test 1: Connection test
    console.log('1. Testing connection...');
    const connectionTest = await airtableService.testConnection();
    
    if (connectionTest.success) {
      console.log('✅ Connection successful!');
    } else {
      console.log('❌ Connection failed:', connectionTest.error);
      return;
    }

    // Test 2: Search for any data
    console.log('\n2. Searching for data...');
    const searchResult = await airtableService.searchTransactions(
      'juan.perez@gmail.com',
      '1234',
      '2024-01-15'
    );

    if (searchResult.success && searchResult.data) {
      console.log('✅ Data found!');
      console.log('📊 Number of records:', searchResult.data.length);
      
      if (searchResult.data.length > 0) {
        console.log('\n📋 First record:');
        const record = searchResult.data[0];
        console.log('  - Customer:', record.Customer);
        console.log('  - Amount:', record.Amount);
        console.log('  - Status:', record.Status);
        console.log('  - Card Type:', record['Card Type']);
        console.log('  - Transaction ID:', record['Transaction ID']);
      }
    } else {
      console.log('❌ No data found or error:', searchResult.error);
    }

    // Test 3: Try a broader search
    console.log('\n3. Trying broader search...');
    const broadSearch = await airtableService.searchTransactions(
      'juan',
      '1234'
    );

    if (broadSearch.success && broadSearch.data) {
      console.log('✅ Broader search found data!');
      console.log('📊 Records found:', broadSearch.data.length);
    } else {
      console.log('❌ Broader search failed:', broadSearch.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAirtable();










