const getAwsUploadErrorMessage = (error) => {
  if (!error || !error.code) {
    return error?.message || 'Unknown AWS upload error.';
  }

  switch (error.code) {
    case 'InvalidAccessKeyId':
      return 'AWS Access Key Id is invalid. Update the AWS credentials in backend/.env.';
    case 'SignatureDoesNotMatch':
      return 'AWS signature mismatch; verify your system clock and AWS credentials.';
    case 'NoSuchBucket':
      return `S3 bucket not found: ${process.env.AWS_S3_BUCKET}. Check your bucket name and region.`;
    case 'AccessDenied':
      return 'Access denied when uploading to S3. Check IAM permissions for the AWS user.';
    case 'CredentialsError':
      return 'AWS credentials are invalid or expired. Update the credentials in backend/.env.';
    default:
      return error.message;
  }
};

const validateAwsConfig = () => {
  const required = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_S3_BUCKET'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    return `AWS config missing: ${missing.join(', ')}.`;
  }
  return null;
};

module.exports = { getAwsUploadErrorMessage, validateAwsConfig };
