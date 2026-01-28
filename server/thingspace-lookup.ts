const ICCID = "89148000008981892197";

const THINGSPACE_CLIENT_ID = process.env.THINGSPACE_CLIENT_ID;
const THINGSPACE_CLIENT_SECRET = process.env.THINGSPACE_CLIENT_SECRET;
const THINGSPACE_USERNAME = process.env.THINGSPACE_USERNAME;
const THINGSPACE_PASSWORD = process.env.THINGSPACE_PASSWORD;
const THINGSPACE_ACCOUNT_NAME = process.env.THINGSPACE_ACCOUNT_NAME;

const BASE_URL = "https://thingspace.verizon.com/api";

async function getOAuthToken(): Promise<string | null> {
  console.log("\n=== Step 1: Getting OAuth2 Access Token ===");
  
  const credentials = Buffer.from(`${THINGSPACE_CLIENT_ID}:${THINGSPACE_CLIENT_SECRET}`).toString('base64');
  
  try {
    const response = await fetch(`${BASE_URL}/ts/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials'
    });

    const text = await response.text();
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      console.log(`OAuth Error: ${text}`);
      return null;
    }

    const data = JSON.parse(text);
    console.log(`Token type: ${data.token_type}`);
    console.log(`Expires in: ${data.expires_in} seconds`);
    console.log(`Scope: ${data.scope}`);
    console.log(`Access token obtained successfully`);
    
    return data.access_token;
  } catch (error) {
    console.log(`OAuth request failed: ${error}`);
    return null;
  }
}

async function getSessionToken(oauthToken: string): Promise<string | null> {
  console.log("\n=== Step 2: Getting M2M Session Token ===");
  
  try {
    const response = await fetch(`${BASE_URL}/m2m/v1/session/login`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${oauthToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: THINGSPACE_USERNAME,
        password: THINGSPACE_PASSWORD
      })
    });

    const text = await response.text();
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      console.log(`Session Error: ${text}`);
      return null;
    }

    const data = JSON.parse(text);
    console.log(`Session token obtained successfully`);
    
    return data.sessionToken;
  } catch (error) {
    console.log(`Session request failed: ${error}`);
    return null;
  }
}

async function listDevices(oauthToken: string, sessionToken: string): Promise<any[]> {
  console.log("\n=== Step 3: Listing Devices ===");
  console.log(`Looking for ICCID: ${ICCID}`);
  
  try {
    const response = await fetch(`${BASE_URL}/m2m/v1/devices/actions/list`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${oauthToken}`,
        'VZ-M2M-Token': sessionToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountName: THINGSPACE_ACCOUNT_NAME,
        filter: {
          deviceIdentifierFilters: [
            {
              kind: "iccid",
              contains: ICCID
            }
          ]
        },
        maxNumberOfDevices: 500
      })
    });

    const text = await response.text();
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      console.log(`List Devices Error: ${text}`);
      
      console.log("\n=== Trying alternate query method ===");
      const altResponse = await fetch(`${BASE_URL}/m2m/v1/devices/actions/list`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${oauthToken}`,
          'VZ-M2M-Token': sessionToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountName: THINGSPACE_ACCOUNT_NAME,
          maxNumberOfDevices: 500,
          largestDeviceIdSeen: 0
        })
      });
      
      const altText = await altResponse.text();
      console.log(`Alt Response status: ${altResponse.status}`);
      
      if (!altResponse.ok) {
        console.log(`Alt List Error: ${altText}`);
        return [];
      }
      
      const altData = JSON.parse(altText);
      const devices = altData.devices || [];
      console.log(`Total devices found: ${devices.length}`);
      
      const matchingDevice = devices.find((device: any) => 
        device.deviceIds?.some((id: any) => id.id === ICCID)
      );
      
      if (matchingDevice) {
        return [matchingDevice];
      }
      
      return [];
    }

    const data = JSON.parse(text);
    return data.devices || [];
  } catch (error) {
    console.log(`List devices request failed: ${error}`);
    return [];
  }
}

async function getDeviceInfo(oauthToken: string, sessionToken: string): Promise<any> {
  console.log("\n=== Getting Device Information ===");
  
  try {
    const response = await fetch(`${BASE_URL}/m2m/v1/devices/information?accountName=${THINGSPACE_ACCOUNT_NAME}&iccid=${ICCID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${oauthToken}`,
        'VZ-M2M-Token': sessionToken,
        'Content-Type': 'application/json',
      }
    });

    const text = await response.text();
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      console.log(`Device Info Error: ${text}`);
      return null;
    }

    return JSON.parse(text);
  } catch (error) {
    console.log(`Device info request failed: ${error}`);
    return null;
  }
}

function displayDevice(device: any) {
  console.log("\n=========================================");
  console.log("DEVICE DETAILS");
  console.log("=========================================");
  
  console.log(`\nAccount: ${device.accountName}`);
  console.log(`State: ${device.state}`);
  console.log(`Connected: ${device.connected}`);
  console.log(`IP Address: ${device.ipAddress || 'N/A'}`);
  console.log(`Last Connection: ${device.lastConnectionDate || 'N/A'}`);
  console.log(`Last Activation: ${device.lastActivationDate || 'N/A'}`);
  
  if (device.deviceIds?.length > 0) {
    console.log(`\n--- Device Identifiers ---`);
    device.deviceIds.forEach((id: any) => {
      console.log(`  ${id.kind.toUpperCase()}: ${id.id}`);
    });
  }
  
  if (device.carrierInformations?.length > 0) {
    console.log(`\n--- Carrier Information ---`);
    device.carrierInformations.forEach((carrier: any) => {
      console.log(`  Carrier: ${carrier.carrierName}`);
      console.log(`  Service Plan: ${carrier.servicePlan}`);
      console.log(`  State: ${carrier.state}`);
    });
  }
  
  if (device.extendedAttributes?.length > 0) {
    console.log(`\n--- Extended Attributes ---`);
    device.extendedAttributes.forEach((attr: any) => {
      console.log(`  ${attr.key}: ${attr.value}`);
    });
  }
  
  if (device.billingCycleEndDate) {
    console.log(`\nBilling Cycle End: ${device.billingCycleEndDate}`);
  }
  
  console.log("");
}

async function main() {
  console.log("=========================================");
  console.log("ThingSpace Device Lookup");
  console.log("=========================================");
  console.log(`ICCID: ${ICCID}`);
  console.log(`Account: ${THINGSPACE_ACCOUNT_NAME}`);
  
  if (!THINGSPACE_CLIENT_ID || !THINGSPACE_CLIENT_SECRET) {
    console.log("\nError: Missing THINGSPACE_CLIENT_ID or THINGSPACE_CLIENT_SECRET");
    return;
  }
  
  if (!THINGSPACE_USERNAME || !THINGSPACE_PASSWORD) {
    console.log("\nError: Missing THINGSPACE_USERNAME or THINGSPACE_PASSWORD");
    return;
  }
  
  if (!THINGSPACE_ACCOUNT_NAME) {
    console.log("\nError: Missing THINGSPACE_ACCOUNT_NAME");
    return;
  }
  
  const oauthToken = await getOAuthToken();
  if (!oauthToken) {
    console.log("\nFailed to get OAuth token. Check your client credentials.");
    return;
  }
  
  const sessionToken = await getSessionToken(oauthToken);
  if (!sessionToken) {
    console.log("\nFailed to get session token. Check your username/password.");
    return;
  }
  
  const devices = await listDevices(oauthToken, sessionToken);
  
  if (devices.length > 0) {
    console.log(`\n--- Found ${devices.length} matching device(s) ---`);
    devices.forEach(displayDevice);
  } else {
    console.log("\nNo device found with that ICCID in this account.");
    
    const deviceInfo = await getDeviceInfo(oauthToken, sessionToken);
    if (deviceInfo) {
      console.log("\n--- Device Info Response ---");
      console.log(JSON.stringify(deviceInfo, null, 2));
    }
  }
}

main();
