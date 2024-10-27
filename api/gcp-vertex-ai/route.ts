import { getVercelOidcToken } from '@vercel/functions/oidc';
import { ExternalAccountClient } from 'google-auth-library';
import { createVertex } from '@ai-sdk/google-vertex';
import { generateText } from 'ai';

const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const GCP_PROJECT_NUMBER = process.env.GCP_PROJECT_NUMBER;
const GCP_SERVICE_ACCOUNT_EMAIL = process.env.GCP_SERVICE_ACCOUNT_EMAIL;
const GCP_WORKLOAD_IDENTITY_POOL_ID = process.env.GCP_WORKLOAD_IDENTITY_POOL_ID;
const GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID =
  process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID;

// Initialize the External Account Client
const authClient = ExternalAccountClient.fromJSON({
  type: 'external_account',
  audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${GCP_WORKLOAD_IDENTITY_POOL_ID}/providers/${GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID}`,
  subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
  token_url: 'https://sts.googleapis.com/v1/token',
  service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${GCP_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
  subject_token_supplier: {
    // Use the Vercel OIDC token as the subject token
    getSubjectToken: getVercelOidcToken,
  },
});

// Ensure that authClient is not null
if (!authClient) {
  throw new Error('Failed to create External Account Client.');
}

const vertex = createVertex({
  project: GCP_PROJECT_ID,
  location: 'us-central1',
  googleAuthOptions: {
    authClient, // Now it's guaranteed to be non-null
    projectId: GCP_PROJECT_ID,
  },
});

// Export the route handler
export const GET = async (req: Request) => {
  try {
    const result = await generateText({
      model: vertex('gemini-1.5-flash'),
      prompt: 'Write a vegetarian lasagna recipe for 4 people.',
    });
    return Response.json(result);
  } catch (error) {
    console.error('Error generating text:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};