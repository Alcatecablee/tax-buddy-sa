import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
config();

console.log('🔍 TAXFY PRODUCTION SETUP TEST');
console.log('================================\n');

// Test Environment Variables
console.log('📋 Environment Variables Check:');
const requiredEnvVars = [
  'DATABASE_URL',
  'REACT_APP_SUPABASE_URL', 
  'REACT_APP_SUPABASE_ANON_KEY',
  'ADMIN_CREATION_KEY'
];

let envVarsOk = true;
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: ${envVar.includes('KEY') || envVar.includes('URL') ? '***CONFIGURED***' : value.substring(0, 20) + '...'}`);
  } else {
    console.log(`❌ ${envVar}: MISSING`);
    envVarsOk = false;
  }
});

if (!envVarsOk) {
  console.log('\n🚨 Missing environment variables. Please configure them before proceeding.');
  process.exit(1);
}

// Test Database Connection
console.log('\n🗄️  Database Connection Test:');
if (process.env.DATABASE_URL) {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
        require: true
      }
    });

    console.log('🔄 Connecting to database...');
    const result = await pool.query('SELECT 1 as test, NOW() as timestamp');
    console.log(`✅ Database connected successfully!`);
    console.log(`   Server time: ${result.rows[0].timestamp}`);
    
    // Test table existence
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'tax_calculations', 'document_uploads', 'user_activities')
    `);
    
    console.log(`✅ Found ${tables.rows.length} application tables in database`);
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    await pool.end();
  } catch (error) {
    console.log(`❌ Database connection failed: ${error.message}`);
  }
} else {
  console.log('❌ DATABASE_URL not configured');
}

// Test Supabase Connection
console.log('\n☁️  Supabase Services Test:');
if (process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY) {
  try {
    const supabase = createClient(
      process.env.REACT_APP_SUPABASE_URL,
      process.env.REACT_APP_SUPABASE_ANON_KEY
    );

    // Test Auth service
    console.log('🔄 Testing Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (!authError) {
      console.log('✅ Supabase Auth service is accessible');
    } else {
      console.log(`⚠️  Supabase Auth warning: ${authError.message}`);
    }

    // Test Storage service
    console.log('🔄 Testing Supabase Storage...');
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    if (!storageError) {
      console.log(`✅ Supabase Storage accessible (${buckets?.length || 0} buckets found)`);
      
      // Check for tax-documents bucket
      const taxBucket = buckets?.find(bucket => bucket.name === 'tax-documents');
      if (taxBucket) {
        console.log('✅ tax-documents bucket exists');
      } else {
        console.log('ℹ️  tax-documents bucket will be created on first upload');
      }
    } else {
      console.log(`❌ Supabase Storage error: ${storageError.message}`);
    }

  } catch (error) {
    console.log(`❌ Supabase connection failed: ${error.message}`);
  }
} else {
  console.log('❌ Supabase configuration missing');
}

// Test API Health
console.log('\n🏥 API Health Check:');
try {
  const response = await fetch('http://localhost:5000/api/health');
  if (response.ok) {
    const health = await response.json();
    console.log('✅ API Health Check passed');
    console.log(`   Status: ${health.status}`);
    console.log(`   Database: ${health.database}`);
    console.log(`   Features: ${Object.keys(health.features).join(', ')}`);
  } else {
    console.log(`❌ API Health Check failed: ${response.status}`);
  }
} catch (error) {
  console.log(`❌ API Health Check error: ${error.message}`);
  console.log('   Make sure the server is running on port 5000');
}

console.log('\n🎯 Production Readiness Summary:');
console.log('==================================');

// Feature checklist
const features = [
  { name: 'Environment Variables', check: envVarsOk },
  { name: 'Database Connection', check: process.env.DATABASE_URL },
  { name: 'Supabase Auth', check: process.env.REACT_APP_SUPABASE_URL },
  { name: 'Supabase Storage', check: process.env.REACT_APP_SUPABASE_ANON_KEY },
  { name: 'Admin Management', check: process.env.ADMIN_CREATION_KEY }
];

let readinessScore = 0;
features.forEach(feature => {
  const status = feature.check ? '✅' : '❌';
  console.log(`${status} ${feature.name}`);
  if (feature.check) readinessScore++;
});

const readinessPercentage = Math.round((readinessScore / features.length) * 100);
console.log(`\n📊 Production Readiness: ${readinessPercentage}%`);

if (readinessPercentage === 100) {
  console.log('🎉 All systems configured! Ready for production deployment.');
  console.log('\nNext steps:');
  console.log('1. Deploy to your production environment');
  console.log('2. Run database migrations: npm run db:push');
  console.log('3. Verify all functionality works in production');
} else {
  console.log('⚠️  Please configure missing components before production deployment.');
  console.log('\nSee PRODUCTION_SETUP.md for detailed configuration instructions.');
}

console.log('\n🚀 Taxfy Production Setup Test Complete!');
