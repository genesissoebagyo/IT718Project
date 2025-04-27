# Book Recommendation App

## Purpose
A lightweight web application to help users discover book recommendations based on genre. Built using AWS serverless architecture.

## Architecture
- **Frontend:** HTML/CSS/JavaScript hosted on S3 and delivered via CloudFront.
- **Backend:** API Gateway connected to AWS Lambda.
- **Database:** DynamoDB caches book recommendations.
- **Monitoring:** CloudWatch Alarms with SNS email notifications for Lambda errors.

## AWS Services Used
- S3
- CloudFront
- API Gateway (HTTP API)
- Lambda (Node.js 18.x runtime)
- DynamoDB (PAY_PER_REQUEST mode)
- SNS + CloudWatch

## DevOps Process
Deployed and managed using AWS CLI commands and manual configuration through AWS Console. Ad-hoc DevOps style focusing on simplicity and cost-efficiency.

## How It Works
1. User enters a genre on the website.
2. API Gateway triggers the Lambda function.
3. Lambda queries DynamoDB for cached recommendations.
4. If not cached, Lambda fetches from Google Books API.
5. Results are displayed instantly on the frontend.

## Repository Contents
- `index.html` - Frontend code.
- `index.mjs` - Backend Lambda function.
- `README.md` - Project overview and instructions.
- `architecture_diagram.png` - (Optional) Visual representation of architecture.

## Live Demo
Available through CloudFront: [Insert your CloudFront URL here]

---
