# CareLine AI

CareLine AI is a full-stack healthcare communication workflow simulator. It demonstrates how a clinic could process fictional patient scheduling requests, identify the request type, propose an appointment action, and route uncertain cases to staff for review.

## Project Purpose

Healthcare staff often spend significant time responding to scheduling and administrative requests. This project simulates an AI-assisted workflow that helps transform a patient request into a traceable, reviewable scheduling action.

## Core Features

- Submit simulated patient scheduling requests
- Classify request intents such as schedule, reschedule, and cancel
- Extract appointment-related details from a request
- Route low-confidence requests to a staff review queue
- Display provider availability and appointment status
- Prevent duplicate appointment bookings
- Record workflow actions in an audit trail

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, TypeScript, Express
- Database: PostgreSQL
- Validation: Zod
- Local development: Docker and Docker Compose
- Version control: Git and GitHub

## Important Notice

This is an educational portfolio project. It uses only fictional, non-identifying sample data and is not a clinical system, medical device, or HIPAA-compliant product.

## Planned Architecture

Patient Simulator -> API -> Workflow Engine -> PostgreSQL Database -> Staff Dashboard

## Local Setup

Setup instructions will be added as the application is developed.

## Author

Miti Patel