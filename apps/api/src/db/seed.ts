import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import * as bcrypt from 'bcrypt';

async function seed() {
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql, { schema });

    console.log('🌱 Seeding database...');

    try {
        // 1. Create Users
        console.log('Creating users...');
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        const [superadmin] = await db.insert(schema.users).values({
            email: 'superadmin@solarpanel.com',
            passwordHash: hashedPassword,
            role: 'superadmin',
            fullName: 'Super Admin',
            phone: '+91-9999999999',
            isActive: true,
            emailVerified: true,
        }).returning();

        const [admin] = await db.insert(schema.users).values({
            email: 'admin@solarpanel.com',
            passwordHash: hashedPassword,
            role: 'admin',
            fullName: 'Admin User',
            phone: '+91-9999999998',
            isActive: true,
            emailVerified: true,
        }).returning();

        const [agent1] = await db.insert(schema.users).values({
            email: 'agent1@solarpanel.com',
            passwordHash: hashedPassword,
            role: 'agent',
            fullName: 'Agent Kumar',
            phone: '+91-9999999997',
            isActive: true,
            emailVerified: true,
        }).returning();

        const [agent2] = await db.insert(schema.users).values({
            email: 'agent2@solarpanel.com',
            passwordHash: hashedPassword,
            role: 'agent',
            fullName: 'Agent Singh',
            phone: '+91-9999999996',
            isActive: true,
            emailVerified: true,
        }).returning();

        const [user1] = await db.insert(schema.users).values({
            email: 'user@example.com',
            passwordHash: hashedPassword,
            role: 'user',
            fullName: 'Test User',
            phone: '+91-9876543210',
            isActive: true,
            emailVerified: true,
        }).returning();

        console.log('✅ Users created');

        // 2. Create Schemes
        console.log('Creating schemes...');
        const [scheme1] = await db.insert(schema.schemes).values({
            name: 'PM Surya Ghar Muft Bijli Yojana',
            slug: 'pm-surya-ghar-muft-bijli',
            description: 'The PM Surya Ghar Muft Bijli Yojana is a flagship initiative to provide free solar electricity to 1 crore households. Under this scheme, households can avail subsidies for rooftop solar installations.',
            shortDescription: 'Get free solar electricity with government subsidy up to ₹78,000',
            eligibilityCriteria: {
                criteria: [
                    'Indian citizen with valid ID proof',
                    'Residential property owner',
                    'Adequate rooftop space (minimum 100 sq ft)',
                    'Stable roof structure capable of bearing solar panel weight'
                ]
            },
            benefits: 'Up to ₹78,000 subsidy, reduced electricity bills, 25-year panel warranty, net metering benefits',
            subsidyPercentage: '40.00',
            maxSubsidyAmount: '78000.00',
            minCapacity: '1.00',
            maxCapacity: '10.00',
            isActive: true,
            createdBy: admin.id,
        }).returning();

        const [scheme2] = await db.insert(schema.schemes).values({
            name: 'Grid-Connected Rooftop Solar Programme',
            slug: 'grid-connected-rooftop-solar',
            description: 'This programme aims to promote rooftop solar power across residential, institutional, and social sectors. It provides Central Financial Assistance (CFA) to encourage solar adoption.',
            shortDescription: 'Commercial and residential solar with up to 20% subsidy',
            eligibilityCriteria: {
                criteria: [
                    'Residential or commercial property',
                    'Connection to electricity grid',
                    'Approved by local electricity distribution company',
                    'Compliance with technical specifications'
                ]
            },
            benefits: 'Up to 20% subsidy for residential, reduced energy costs, environmental benefits',
            subsidyPercentage: '20.00',
            maxSubsidyAmount: '200000.00',
            minCapacity: '1.00',
            maxCapacity: '50.00',
            isActive: true,
            createdBy: admin.id,
        }).returning();

        const [scheme3] = await db.insert(schema.schemes).values({
            name: 'Solar Rooftop Subsidy for Farmers',
            slug: 'solar-rooftop-farmers',
            description: 'Special subsidy scheme for farmers to install solar panels on farm buildings, reducing agricultural electricity costs and promoting sustainable farming.',
            shortDescription: 'Farmers can get up to 60% subsidy on solar installations',
            eligibilityCriteria: {
                criteria: [
                    'Valid farmer identification',
                    'Agricultural land ownership documents',
                    'Farm building with suitable rooftop',
                    'Electricity connection for agricultural use'
                ]
            },
            benefits: '60% subsidy, reduced irrigation costs, additional income from surplus power',
            subsidyPercentage: '60.00',
            maxSubsidyAmount: '150000.00',
            minCapacity: '3.00',
            maxCapacity: '25.00',
            isActive: true,
            createdBy: admin.id,
        }).returning();

        console.log('✅ Schemes created');

        // 3. Assign Agents to Schemes
        console.log('Assigning agents to schemes...');
        await db.insert(schema.agentSchemes).values([
            {
                agentId: agent1.id,
                schemeId: scheme1.id,
                assignedBy: admin.id,
                isActive: true,
            },
            {
                agentId: agent1.id,
                schemeId: scheme2.id,
                assignedBy: admin.id,
                isActive: true,
            },
            {
                agentId: agent2.id,
                schemeId: scheme3.id,
                assignedBy: admin.id,
                isActive: true,
            },
        ]);

        console.log('✅ Agents assigned to schemes');

        // 4. Create Sample Application
        console.log('Creating sample application...');
        const [application1] = await db.insert(schema.applications).values({
            applicationNumber: 'APP-2024-0001',
            userId: user1.id,
            schemeId: scheme1.id,
            assignedAgentId: agent1.id,
            status: 'pending',
            applicantName: user1.fullName,
            applicantEmail: user1.email,
            applicantPhone: user1.phone!,
            address: '123 Green Street, Solar Colony',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            propertyType: 'residential',
            roofArea: '500.00',
            roofType: 'concrete',
            requestedCapacity: '3.00',
            estimatedCost: '180000.00',
            estimatedSubsidy: '72000.00',
            documents: [],
        }).returning();

        console.log('✅ Sample application created');

        // 5. Create Blog Posts
        console.log('Creating blog posts...');
        await db.insert(schema.blogPosts).values([
            {
                title: 'Understanding Solar Panel Installation: A Complete Guide',
                slug: 'understanding-solar-panel-installation-guide',
                excerpt: 'Everything you need to know about installing solar panels on your rooftop, from planning to maintenance.',
                content: `# Understanding Solar Panel Installation

Solar energy is revolutionizing how we power our homes. This comprehensive guide walks you through everything you need to know about solar panel installation.

## Why Choose Solar Energy?

1. **Reduce Electricity Bills**: Save up to 90% on your monthly bills
2. **Environmental Benefits**: Reduce carbon footprint
3. **Government Subsidies**: Get up to ₹78,000 in subsidies
4. **Increase Property Value**: Solar homes sell faster

## Installation Process

### Step 1: Site Assessment
Our experts visit your property to assess roof condition, sun exposure, and electrical system.

### Step 2: System Design
We design a custom solar system based on your energy needs and roof space.

### Step 3: Permissions
We handle all paperwork including electricity board approvals.

### Step 4: Installation
Professional installation typically takes 1-2 days.

### Step 5: Activation
After inspection, your system is connected to the grid and activated.

## Maintenance

Solar panels require minimal maintenance:
- Clean panels 2-3 times per year
- Annual professional inspection
- Monitor energy production

## Get Started Today

Apply for government schemes and start your solar journey!`,
                authorId: admin.id,
                isPublished: true,
                publishedAt: new Date(),
                tags: ['solar', 'installation', 'guide', 'renewable energy'],
                metaTitle: 'Complete Guide to Solar Panel Installation in India | Solar Panel Platform',
                metaDescription: 'Learn everything about solar panel installation, government subsidies, and how to get started with renewable energy for your home.',
                viewCount: 0,
            },
            {
                title: 'Top 5 Government Solar Schemes in India 2024',
                slug: 'top-5-government-solar-schemes-india-2024',
                excerpt: 'Discover the best government solar schemes offering subsidies and benefits for residential and commercial installations.',
                content: `# Top 5 Government Solar Schemes in India 2024

The Government of India is promoting solar energy adoption through various schemes and subsidies. Here are the top schemes you should know about.

## 1. PM Surya Ghar Muft Bijli Yojana

The flagship scheme aims to provide solar power to 1 crore households.

**Benefits:**
- Up to ₹78,000 subsidy
- Free electricity for qualifying households
- 25-year warranty on solar panels

## 2. Grid-Connected Rooftop Solar Programme

Promotes rooftop solar across all sectors.

**Benefits:**
- 20% subsidy for residential
- Net metering facility
- Reduced carbon footprint

## 3. Solar Rooftop Subsidy for Farmers

Special scheme for agricultural sector.

**Benefits:**
- 60% subsidy on installation
- Reduced irrigation costs
- Additional income from surplus power

## 4. PM-KUSUM Scheme

For standalone solar pumps and grid-connected pumps.

**Benefits:**
- 90% subsidy for small farmers
- Reliable power for irrigation
- Income from selling surplus power

## 5. Solar Parks Scheme

For large-scale solar installations.

**Benefits:**
- Transmission infrastructure
- Plug-and-play model
- Viability gap funding

## How to Apply

Visit our platform to explore schemes and submit applications online. Our agents will guide you through the process.`,
                authorId: admin.id,
                isPublished: true,
                publishedAt: new Date(),
                tags: ['government schemes', 'subsidies', 'solar policy', 'india'],
                metaTitle: 'Top 5 Government Solar Schemes in India 2024 - Complete List',
                metaDescription: 'Comprehensive guide to government solar schemes in India offering subsidies up to 90%. Learn about PM Surya Ghar Yojana, rooftop schemes, and more.',
                viewCount: 0,
            },
        ]);

        console.log('✅ Blog posts created');

        // 6. Create Notification Templates
        console.log('Creating notification templates...');
        await db.insert(schema.notificationTemplates).values([
            {
                code: 'APPLICATION_SUBMITTED_USER',
                name: 'Application Submitted - User Notification',
                type: 'email',
                subject: 'Application Submitted Successfully - {{applicationNumber}}',
                template: `Dear {{applicantName}},

Your application for {{schemeName}} has been submitted successfully.

Application Number: {{applicationNumber}}
Submitted On: {{submittedDate}}
Scheme: {{schemeName}}
Requested Capacity: {{requestedCapacity}} kW
Estimated Cost: ₹{{estimatedCost}}
Estimated Subsidy: ₹{{estimatedSubsidy}}

Your application is under review and will be assigned to an agent shortly. You will receive email and WhatsApp notifications for any updates.

You can track your application status at: {{trackingUrl}}

Thank you for choosing solar energy!

Best regards,
Solar Panel Team`,
                variables: {
                    applicantName: 'string',
                    applicationNumber: 'string',
                    submittedDate: 'date',
                    schemeName: 'string',
                    requestedCapacity: 'number',
                    estimatedCost: 'number',
                    estimatedSubsidy: 'number',
                    trackingUrl: 'string',
                },
                isActive: true,
            },
            {
                code: 'APPLICATION_ASSIGNED_AGENT',
                name: 'New Application - Agent Notification',
                type: 'email',
                subject: 'New Application Assigned - {{applicationNumber}}',
                template: `Dear {{agentName}},

A new application has been assigned to you for review.

Application Number: {{applicationNumber}}
Applicant: {{applicantName}}
Scheme: {{schemeName}}
Location: {{city}}, {{state}}
Requested Capacity: {{requestedCapacity}} kW
Submitted On: {{submittedDate}}

Please review the application at your earliest convenience: {{applicationUrl}}

Application Details:
- Email: {{applicantEmail}}
- Phone: {{applicantPhone}}
- Address: {{address}}

Thank you!`,
                variables: {
                    agentName: 'string',
                    applicationNumber: 'string',
                    applicantName: 'string',
                    schemeName: 'string',
                    city: 'string',
                    state: 'string',
                    requestedCapacity: 'number',
                    submittedDate: 'date',
                    applicationUrl: 'string',
                    applicantEmail: 'string',
                    applicantPhone: 'string',
                    address: 'string',
                },
                isActive: true,
            },
            {
                code: 'APPLICATION_ASSIGNED_AGENT_WHATSAPP',
                name: 'New Application - Agent WhatsApp',
                type: 'whatsapp',
                subject: null,
                template: `🔔 *New Application Assigned*

*App#:* {{applicationNumber}}
*Applicant:* {{applicantName}}
*Scheme:* {{schemeName}}
*Location:* {{city}}, {{state}}
*Capacity:* {{requestedCapacity}} kW

Review now: {{applicationUrl}}`,
                variables: {
                    applicationNumber: 'string',
                    applicantName: 'string',
                    schemeName: 'string',
                    city: 'string',
                    state: 'string',
                    requestedCapacity: 'number',
                    applicationUrl: 'string',
                },
                isActive: true,
            },
            {
                code: 'APPLICATION_APPROVED',
                name: 'Application Approved - User Notification',
                type: 'email',
                subject: 'Application Approved - {{applicationNumber}}',
                template: `🎉 Congratulations {{applicantName}}!

Your solar panel application has been APPROVED!

Application Number: {{applicationNumber}}
Scheme: {{schemeName}}
Approved Capacity: {{requestedCapacity}} kW
Approved Subsidy: ₹{{estimatedSubsidy}}

Next Steps:
1. Our installation team will contact you shortly
2. Site survey will be scheduled
3. Installation will be completed within 30 days

You can track progress at: {{trackingUrl}}

Welcome to the solar revolution!

Best regards,
Solar Panel Team`,
                variables: {
                    applicantName: 'string',
                    applicationNumber: 'string',
                    schemeName: 'string',
                    requestedCapacity: 'number',
                    estimatedSubsidy: 'number',
                    trackingUrl: 'string',
                },
                isActive: true,
            },
        ]);

        console.log('✅ Notification templates created');

        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`- Superadmin: superadmin@solarpanel.com / Admin@123`);
        console.log(`- Admin: admin@solarpanel.com / Admin@123`);
        console.log(`- Agent 1: agent1@solarpanel.com / Admin@123`);
        console.log(`- Agent 2: agent2@solarpanel.com / Admin@123`);
        console.log(`- Test User: user@example.com / Admin@123`);
        console.log(`- ${3} Schemes created`);
        console.log(`- ${1} Sample application created`);
        console.log(`- ${2} Blog posts created`);
        console.log(`- ${4} Notification templates created`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

seed()
    .then(() => {
        console.log('\n✅ Seed process completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Seed process failed:', error);
        process.exit(1);
    });
