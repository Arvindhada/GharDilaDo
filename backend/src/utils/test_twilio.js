const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || accountSid.includes('your_')) {
    console.error("❌ Twilio keys not configured in .env");
    process.exit(1);
}

const client = require('twilio')(accountSid, authToken);

const testNumber = process.argv[2] || "+916378091973"; // Default or from arg

console.log(`🚀 Starting Twilio Test for: ${testNumber}`);
console.log(`📡 Using Twilio Number: ${twilioPhone}`);

client.messages.create({
    body: "GharDilaDo: This is a diagnostic test for Real OTP delivery.",
    from: twilioPhone,
    to: testNumber
})
.then(message => {
    console.log("✅ SUCCESS!");
    console.log(`📝 Message SID: ${message.sid}`);
    console.log(`📊 Status: ${message.status}`);
    console.log(`💡 Note: If status is 'queued' or 'sent' but you don't receive it, check if your number is 'Verified' in Twilio Trial console.`);
})
.catch(error => {
    console.log("❌ FAILED!");
    console.log(`🛑 Error Code: ${error.code}`);
    console.log(`💬 Message: ${error.message}`);
    
    if (error.code === 21608) {
        console.log("\n⚠️  EXPLANATION found:");
        console.log("This number is NOT verified in your Twilio Trial account.");
        console.log("To fix this, go to: https://console.twilio.com/ -> Phone Numbers -> Verified Caller IDs");
        console.log("Add your number there, verify it, and then Real OTP will work!");
    }
});
