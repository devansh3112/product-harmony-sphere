import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, Users, Layers, Link } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// Form schema for new/edit product
const productSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  shortDescription: z.string().min(10, { message: "Short description must be at least 10 characters." }),
  fullDescription: z.string(),
  category: z.string().min(1, { message: "Please select a category." }),
  subscriptionType: z.string().optional(),
  isActive: z.boolean().default(true),
  whitepaperLinks: z.array(
    z.object({
      title: z.string(),
      url: z.string().url({ message: "Please enter a valid URL." })
    })
  ).optional().default([]),
});

// Sample categories data - will be replaced by API call
const sampleCategories = [
  { id: '1', name: 'Networking' },
  { id: '2', name: 'Cloud Services' },
  { id: '3', name: 'Security' },
];

// Define the product type explicitly
interface Product {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  useCases: string[];
  competition: string[];
  subscriptionType: string;
  whitepaperLinks: { title: string; url: string; }[];
  category: string;
  isActive: boolean;
}

// This will be replaced by actual API call once backend is implemented
const fetchProductDetails = async (id: string) => {
  console.log("Fetching product details for:", id);
  
  // For new products, return empty template
  if (id === 'new') {
    return {
      id: 'new',
      name: '',
      shortDescription: '',
      fullDescription: '',
      features: [],
      competition: [],
      useCases: [],
      subscriptionType: '',
      whitepaperLinks: [],
      category: '',
      isActive: true
    };
  }
  
  // Simulate API call delay for existing products
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data - will be replaced by actual API call
  switch (id) {
    // Carbon Black Products
    case '7': // Carbon Black App Control
      return {
        id: '7',
        name: 'Carbon Black App Control',
        shortDescription: 'Trusted software enforcement with flexible deployment',
        fullDescription: 'Carbon Black App Control leverages a positive security model allowing only trusted software to run. It can be deployed on-premise, on private and public clouds.',
        features: [
          'Positive security model',
          'On-premise and cloud deployment',
          'Trusted software enforcement'
        ],
        useCases: [
          'Reduce unplanned downtime of critical systems',
          'Reduce costly re-imaging',
          'Consolidates agents',
          'Prevent unwanted changes to system configs',
          'Protect legacy systems running on end-of-life operating systems',
          'Manage software licenses accurately',
          'File inventory',
          'Application Vulnerability assessment',
          'Regulatory'
        ],
        competition: [
          'Ivanti',
          'Airlock Digital',
          'Tripwire'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Forrester Report', url: 'https://tei.forrester.com/go/carbonblack/appcontrol/?lang=en-us' },
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/carbon-black/app-control.html' },
          { title: 'Developer Documentation', url: 'https://developer.carbonblack.com/reference/enterprise-protection/' },
          { title: 'Technical Overview', url: 'https://docs.broadcom.com/docs/carbon-black-app-control-technical-overview' }
        ],
        category: 'Carbon Black',
        isActive: true
      };

    case '8': // Carbon Black EDR
      return {
        id: '8',
        name: 'Carbon Black EDR',
        shortDescription: 'Advanced threat detection and response',
        fullDescription: 'Carbon Black EDR detects and responds to advanced attacks through a comprehensive and integrated approach for security teams. Carbon Black provides immediate access to the most complete picture of an attack, reducing lengthy investigations from days to minutes. Security teams can proactively hunt for threats, uncover suspicious behavior, disrupt active attacks, and address gaps in defenses before attackers can. Carbon Black EDR gives a proactive and unified defense against evolving threats.',
        features: [
          'Advanced Threat Detection',
          'Incident Response',
          'Threat Hunting',
          'Malware Analysis',
          'Compliance & Reporting',
          'Insider Threat Detection',
          'Data Exfiltration Detection',
          'Operational Efficiency',
          'Third-Party Risk Management',
          'Ransomware Detection',
          'Enhanced Visibility & Control'
        ],
        useCases: [
          'Advanced Threat Detection',
          'Incident Response',
          'Threat Hunting',
          'Malware Analysis',
          'Compliance & Reporting',
          'Insider Threat Detection',
          'Data Exfiltration Detection',
          'Operational Efficiency',
          'Third-Party Risk Management',
          'Ransomware Detection',
          'Enhanced Visibility & Control'
        ],
        competition: [
          'Palo Alto',
          'Crowdstrike',
          'Sentinel One'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/carbon-black/edr.html' }
        ],
        category: 'Carbon Black',
        isActive: true
      };

    case '9': // Carbon Black Endpoint Foundation
      return {
        id: '9',
        name: 'Carbon Black Endpoint Foundation',
        shortDescription: 'NGAV, Behavioral EDR, and Device Control',
        fullDescription: 'NGAV, Behavioral EDR, Device Control',
        features: [
          'NGAV',
          'Behavioral EDR',
          'Device Control'
        ],
        useCases: [
          'Ransomware Defense',
          'Operational efficiency',
          'Malware Analysis',
          'Real Time monitoring',
          'Data Exfiltration Prevention',
          'Remote shell into endpoints for immediate action',
          'Cloud-native platform with single agent & console'
        ],
        competition: [
          'Palo Alto',
          'Crowdstrike',
          'Sentinel One'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/carbon-black/cloud.html' },
          { title: 'Developer Documentation', url: 'https://developer.carbonblack.com/reference/carbon-black-cloud' },
          { title: 'Downloads', url: 'https://www.broadcom.com/support/download-search?pg=Carbon+Black&pf=Carbon+Black&pn=&pa=&po=&dk=&pl=&l=false' },
          { title: 'Forrester Report', url: 'https://tei.forrester.com/go/carbonblack/cloud/index.html?lang=en-us' }
        ],
        category: 'Carbon Black',
        isActive: true
      };

    case '10': // Carbon Black Endpoint Advanced
      return {
        id: '10',
        name: 'Carbon Black Endpoint Advanced',
        shortDescription: 'Live Query, Vulnerability Management, NGAV, Behavioral EDR, and Device Control',
        fullDescription: 'Live Query, Vulnerability Management, NGAV, Behavioral EDR, Device Control',
        features: [
          'Live Query',
          'Vulnerability Management',
          'NGAV',
          'Behavioral EDR',
          'Device Control'
        ],
        useCases: [
          'Ransomware Defense',
          'Operational efficiency',
          'Malware Analysis',
          'Real Time monitoring',
          'Data Exfiltration Prevention',
          'Remote shell into endpoints for immediate action',
          'Cloud-native platform with single agent & console',
          'Pull 1,500+ artifacts across all endpoints',
          'Flexible query scheduler',
          'Filterable & exportable results',
          'Built-in vulnerability context and links to resources',
          'Prioritized and scored based on risk of exploit'
        ],
        competition: [
          'Palo Alto',
          'Crowdstrike',
          'Sentinel One'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/carbon-black/cloud.html' },
          { title: 'Developer Documentation', url: 'https://developer.carbonblack.com/reference/carbon-black-cloud' },
          { title: 'Downloads', url: 'https://www.broadcom.com/support/download-search?pg=Carbon+Black&pf=Carbon+Black&pn=&pa=&po=&dk=&pl=&l=false' },
          { title: 'Forrester Report', url: 'https://tei.forrester.com/go/carbonblack/cloud/index.html?lang=en-us' }
        ],
        category: 'Carbon Black',
        isActive: true
      };

    case '11': // Carbon Black Endpoint Enterprise
      return {
        id: '11',
        name: 'Carbon Black Endpoint Enterprise',
        shortDescription: 'Live Query, Vulnerability Management, NGAV, Behavioral EDR, Device Control, and Enterprise EDR',
        fullDescription: 'Live Query, Vulnerability Management, NGAV, Behavioral EDR, Device Control, Enterprise EDR',
        features: [
          'Live Query',
          'Vulnerability Management',
          'NGAV',
          'Behavioral EDR',
          'Device Control',
          'Enterprise EDR'
        ],
        useCases: [
          'Ransomware Defense',
          'Operational efficiency',
          'Malware Analysis',
          'Real Time monitoring',
          'Data Exfiltration Prevention',
          'Remote shell into endpoints for immediate action',
          'Cloud-native platform with single agent & console',
          'Pull 1,500+ artifacts across all endpoints',
          'Flexible query scheduler',
          'Filterable & exportable results',
          'Built-in vulnerability context and links to resources',
          'Prioritized and scored based on risk of exploit',
          'Continuous and centralized recording of endpoint activity',
          'Out-of-the-box and customizable threat intelligence',
          'Identity intelligence',
          'Attack chain visualization and enterprise-wide search'
        ],
        competition: [
          'Palo Alto',
          'Crowdstrike',
          'Sentinel One'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/carbon-black/cloud.html' },
          { title: 'Developer Documentation', url: 'https://developer.carbonblack.com/reference/carbon-black-cloud' },
          { title: 'Downloads', url: 'https://www.broadcom.com/support/download-search?pg=Carbon+Black&pf=Carbon+Black&pn=&pa=&po=&dk=&pl=&l=false' },
          { title: 'Forrester Report', url: 'https://tei.forrester.com/go/carbonblack/cloud/index.html?lang=en-us' }
        ],
        category: 'Carbon Black',
        isActive: true
      };

    case '12': // Carbon Black Workload Enterprise
      return {
        id: '12',
        name: 'Carbon Black Workload Enterprise',
        shortDescription: 'Enterprise EDR, NGAV, Behavioral EDR, Asset Inventory, Live Query, CIS Benchmarks, vCenter Plug-in, Lifecycle Management, and Vulnerability Management',
        fullDescription: 'Enterprise EDR, NGAV, Behavioral EDR, Asset Inventory, Live Query, CIS Benchmarks, vCenter Plug-in, Lifecycle Management, Vulnerability Management',
        features: [
          'Enterprise EDR',
          'NGAV',
          'Behavioral EDR',
          'Asset Inventory',
          'Live Query',
          'CIS Benchmarks',
          'vCenter Plug-in',
          'Lifecycle Management',
          'Vulnerability Management'
        ],
        useCases: [
          'Public cloud support and account onboarding',
          'CIS benchmarks',
          'Ransomware Defense',
          'Operational efficiency',
          'Malware Analysis',
          'Real Time monitoring',
          'Data Exfiltration Prevention',
          'Remote shell into endpoints for immediate action',
          'Cloud-native platform with single agent & console',
          'Pull 1,500+ artifacts across all endpoints',
          'Flexible query scheduler',
          'Filterable & exportable results',
          'Built-in vulnerability context and links to resources',
          'Prioritized and scored based on risk of exploit',
          'Continuous and centralized recording of endpoint activity',
          'Out-of-the-box and customizable threat intelligence',
          'Identity intelligence',
          'Attack chain visualization and enterprise-wide search'
        ],
        competition: [
          'Palo Alto',
          'Crowdstrike',
          'Sentinel One'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/carbon-black/cloud.html' },
          { title: 'Developer Documentation', url: 'https://developer.carbonblack.com/reference/carbon-black-cloud' },
          { title: 'Downloads', url: 'https://www.broadcom.com/support/download-search?pg=Carbon+Black&pf=Carbon+Black&pn=&pa=&po=&dk=&pl=&l=false' },
          { title: 'Forrester Report', url: 'https://tei.forrester.com/go/carbonblack/cloud/index.html?lang=en-us' }
        ],
        category: 'Carbon Black',
        isActive: true
      };

    case '13': // Carbon Black eNDR/XDR
      return {
        id: '13',
        name: 'Carbon Black eNDR/XDR',
        shortDescription: 'eNDR/XDR',
        fullDescription: 'eNDR/XDR',
        features: [
          'eNDR/XDR'
        ],
        useCases: [
          'Enterprise EDR',
          'Network Visibility',
          'Identity Intelligence'
        ],
        competition: [
          'Palo Alto',
          'Crowdstrike',
          'Sentinel One'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/carbon-black/cloud.html' },
          { title: 'Developer Documentation', url: 'https://developer.carbonblack.com/reference/carbon-black-cloud' },
          { title: 'Downloads', url: 'https://www.broadcom.com/support/download-search?pg=Carbon+Black&pf=Carbon+Black&pn=&pa=&po=&dk=&pl=&l=false' },
          { title: 'Forrester Report', url: 'https://tei.forrester.com/go/carbonblack/cloud/index.html?lang=en-us' }
        ],
        category: 'Carbon Black',
        isActive: true
      };

    case '14': // Carbon Black Host Based Firewall
      return {
        id: '14',
        name: 'Carbon Black Host Based Firewall',
        shortDescription: 'Management console to monitor and control network connections from managed endpoints',
        fullDescription: 'Management console to monitor and control network connections from managed endpoints',
        features: [
          'Flexible rule-based enforcement',
          'Integrated into console policy workflows',
          'Increased visibility into network and application behavior',
          'Streamline enforcement by integrating with native OS firewall tools'
        ],
        useCases: [
          'Flexible rule-based enforcement',
          'Integrated into console policy workflows',
          'Increased visibility into network and application behavior',
          'Streamline enforcement by integrating with native OS firewall tools'
        ],
        competition: [
          'Palo Alto',
          'Crowdstrike',
          'Sentinel One'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/carbon-black/cloud.html' },
          { title: 'Developer Documentation', url: 'https://developer.carbonblack.com/reference/carbon-black-cloud' },
          { title: 'Downloads', url: 'https://www.broadcom.com/support/download-search?pg=Carbon+Black&pf=Carbon+Black&pn=&pa=&po=&dk=&pl=&l=false' },
          { title: 'Forrester Report', url: 'https://tei.forrester.com/go/carbonblack/cloud/index.html?lang=en-us' }
        ],
        category: 'Carbon Black',
        isActive: true
      };

    // Other products (Existing)
    case '30': // Endpoint DLP
      return {
        id: '30',
        name: 'Endpoint DLP (Endpoint Prevent and Endpoint Discover)',
        shortDescription: 'Identifies sensitive information on endpoints (desktops/laptops) and monitors/regulates the flow of that information.',
        fullDescription: 'Identifies sensitive information on endpoints (desktops/laptops) and monitors/regulates the flow of that information.',
        features: [
          'Endpoint Prevent: Stops sensitive data from moving off endpoints (e.g., USB, network shares, applications).',
          'Endpoint Discover: Scans internal hard drives to identify stored confidential data.'
        ],
        useCases: [
          'Data loss prevention for sensitive information (e.g., credit card numbers, personal identification data).',
          'High-performance parallel scanning of endpoints.',
          'Automatic quarantine of confidential files.'
        ],
        competition: [
          'Forcepoint',
          'Zscaler',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/information-security/data-loss-prevention/16-1/about-discovering-and-preventing-data-loss-on-endpoints.html' }
        ],
        category: 'DLP',
        isActive: true
      };

    case '31': // Network DLP
      return {
        id: '31',
        name: 'Network DLP (Network Monitor, Network Prevent for Email, Network Prevent for Web)',
        shortDescription: 'Captures and analyzes network traffic to detect confidential data and metadata over protocols like SMTP, FTP, HTTP, and IM.',
        fullDescription: 'Captures and analyzes network traffic to detect confidential data and metadata over protocols like SMTP, FTP, HTTP, and IM.',
        features: [
          'Network Monitor: Captures and analyzes traffic, detects confidential data, and filters low-risk traffic.',
          'Network Prevent for Email: Monitors and blocks outbound email traffic in-line.',
          'Network Prevent for Web: Integrates with HTTP/HTTPS/FTP proxy servers to reject or modify web requests containing confidential data.'
        ],
        useCases: [
          'Monitor and prevent data loss over email and web traffic.',
          'Integrate with industry-standard mail transfer agents (MTAs) and proxy servers.'
        ],
        competition: [
          'Forcepoint',
          'Zscaler',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Implementation Guide', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/information-security/data-loss-prevention/16-1/implementing-network-monitor.html' }
        ],
        category: 'DLP',
        isActive: true
      };

    case '32': // Storage DLP
      return {
        id: '32',
        name: 'Storage DLP (Endpoint Discover and Network Discover)',
        shortDescription: 'Locates exposed confidential data on network storage and endpoints.',
        fullDescription: 'Locates exposed confidential data on network storage and endpoints.',
        features: [
          'Network Discover Server: Scans selected targets (e.g., files, repositories) to detect confidential information.',
          'Endpoint Discover: Scans endpoints for stored confidential data.'
        ],
        useCases: [
          'Identify and secure exposed confidential data.',
          'High-performance scanning of endpoints and network storage.'
        ],
        competition: [
          'Forcepoint',
          'Zscaler'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Implementation Guide', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/information-security/data-loss-prevention/16-1/implementing-network-monitor.html' }
        ],
        category: 'DLP',
        isActive: true
      };

    case '33': // Cloud DLP (CASB DLP)
      return {
        id: '33',
        name: 'DLP Cloud (CASB DLP, Cloud Detection Service for Email, Cloud Detection Service for Web, OCR in the Cloud)',
        shortDescription: 'Provides data loss prevention for cloud applications (e.g., Office 365, G-Suite, Box, Salesforce).',
        fullDescription: 'Provides data loss prevention for cloud applications (e.g., Office 365, G-Suite, Box, Salesforce).',
        features: [
          'CASB DLP: Integrates with Symantec CloudSOC for SaaS applications.',
          'Cloud Detection Service for Email: Detects confidential data in corporate email (Exchange, Office 365, Gmail).',
          'Cloud Detection Service for Web: Monitors content in cloud applications via Cloud SWG.',
          'OCR in the Cloud: Extracts text from images and PDFs for detection.'
        ],
        useCases: [
          'Monitor and prevent data loss in cloud applications.',
          'Real-time monitoring and detection of policy violations.',
          'OCR for text extraction from images and PDFs.'
        ],
        competition: [
          'Forcepoint',
          'Zscaler'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Cloud Services Guide', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/information-security/data-loss-prevention/16-1/using-cloud-services-to-prevent-data-loss.html' }
        ],
        category: 'DLP',
        isActive: true
      };

    case '34': // SEP-SES
      return {
        id: '34',
        name: 'SEP-SES',
        shortDescription: 'Comprehensive endpoint protection suite',
        fullDescription: 'Symantec Endpoint Security provides advanced protection against modern cyber threats.',
        features: [
          'Application control',
          'Device control',
          'Advanced threat protection'
        ],
        useCases: [
          'Reduce unplanned downtime',
          'Prevent malware infections',
          'Protect legacy systems'
        ],
        competition: [
          'Microsoft',
          'PaloAlto',
          'SentinelOne',
          'Trellix',
          'Crowdstrike',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/endpoint-security/sescloud/Application-Control.html' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '35': // Adaptive Protection
      return {
        id: '35',
        name: 'Adaptive Protection',
        shortDescription: 'Protection against sophisticated attacks',
        fullDescription: 'Adaptive Protection protects enterprise environments from the shift in the threat landscape toward sophisticated and targeted attacks.',
        features: [
          'Living off the Land (LOTL) attack prevention',
          'Customizable protection policies',
          'Advanced threat detection'
        ],
        useCases: [
          'Protect against sophisticated attacks',
          'Customize protection policies',
          'Detect advanced threats'
        ],
        competition: [
          'Microsoft',
          'PaloAlto',
          'SentinelOne',
          'Trellix',
          'Crowdstrike',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/endpoint-security/sescloud/Using-Adaptive-Protection.html' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '36': // AD Threat Defense
      return {
        id: '36',
        name: 'AD Threat Defense',
        shortDescription: 'Active Directory threat defense',
        fullDescription: 'AD breach assessment and threat defense for Active Directory environments.',
        features: [
          'Active Directory breach assessment',
          'Threat detection',
          'Cloud and on-premise deployment'
        ],
        useCases: [
          'Protect Active Directory',
          'Detect breaches',
          'Deploy on cloud or on-premise'
        ],
        competition: [
          'Microsoft',
          'PaloAlto',
          'SentinelOne',
          'Trellix',
          'Crowdstrike',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/endpoint-security/sescloud/Using-Threat-Defense-for-Active-Directory.html' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '37': // Host Integrity
      return {
        id: '37',
        name: 'Host Integrity',
        shortDescription: 'Endpoint compliance and integrity checks',
        fullDescription: 'SEP Host Integrity provides flexible compliance checks and options to automate remediation.',
        features: [
          'Compliance checks',
          'Automated remediation',
          'Scalable policy updates'
        ],
        useCases: [
          'Ensure endpoint compliance',
          'Automate remediation',
          'Scalable policy management'
        ],
        competition: [
          'Microsoft',
          'PaloAlto',
          'SentinelOne',
          'Trellix',
          'Crowdstrike',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/endpoint-security/sescloud/Settings/cs-help-hi-console-v14067393-d4155e15268.html' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '38': // IPS
      return {
        id: '38',
        name: 'IPS',
        shortDescription: 'Network-based intrusion prevention',
        fullDescription: 'Powerful network-based protection prevents attacks from malicious domains, OS and application vulnerabilities before attackers can touch the file system.',
        features: [
          'Network-based protection',
          'Proactive threat prevention',
          'Exploit layer protection'
        ],
        useCases: [
          'Prevent network-based attacks',
          'Protect against OS vulnerabilities',
          'Proactively block threats'
        ],
        competition: [
          'Microsoft',
          'PaloAlto',
          'SentinelOne',
          'Trellix',
          'Crowdstrike',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/endpoint-security/sescloud/about-symantec-ips-signatures-v36817114-d53e9297.html' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '39': // AML
      return {
        id: '39',
        name: 'AML',
        shortDescription: 'Advanced machine learning for threat prevention',
        fullDescription: 'SEP leverages machine learning for prevention, especially when not connected to the cloud.',
        features: [
          'Machine learning-based prevention',
          'Offline threat detection',
          'Advanced threat protection'
        ],
        useCases: [
          'Prevent advanced threats',
          'Detect threats offline',
          'Leverage machine learning'
        ],
        competition: [
          'Microsoft',
          'PaloAlto',
          'SentinelOne',
          'Trellix',
          'Crowdstrike',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/endpoint-security/sescloud/how-does-use-advanced-machine-learning-v120625733-d47e275.html' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '40': // Mobile Threat Management
      return {
        id: '40',
        name: 'MTM (Mobile Threat Management)',
        shortDescription: 'Mobile device threat protection',
        fullDescription: 'Symantec provides best-in-class protection for mobile devices that covers OS vulnerabilities and suspicious and malicious apps as well as risky Wi-Fi identification and protection.',
        features: [
          'Mobile OS protection',
          'Malicious app detection',
          'Risky Wi-Fi protection'
        ],
        useCases: [
          'Protect mobile devices',
          'Detect malicious apps',
          'Identify risky Wi-Fi'
        ],
        competition: [
          'Microsoft',
          'PaloAlto',
          'SentinelOne',
          'Trellix',
          'Crowdstrike',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/endpoint-security/sescloud/Integrations/unified-endpoint-management-v131977090-d4155e1035/configuring-zero-touch-onboarding-of-sep-mobile-app-for-mobile-devices.html' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '41': // Generic Exploit Mitigation
      return {
        id: '41',
        name: 'GEM (Generic Exploit Mitigation)',
        shortDescription: 'Signature-less exploit mitigation',
        fullDescription: 'SEP pre-emptively blocks exploits using heap spray techniques, abuse of java security manager, etc., and works regardless of flaw/bug/vulnerability.',
        features: [
          'Signature-less exploit prevention',
          'Heap spray mitigation',
          'Java security manager protection'
        ],
        useCases: [
          'Prevent zero-day exploits',
          'Mitigate heap spray attacks',
          'Protect against Java vulnerabilities'
        ],
        competition: [
          'Microsoft',
          'PaloAlto',
          'SentinelOne',
          'Trellix',
          'Crowdstrike',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/endpoint-security/sescloud/Glossary/memory-exploit-mitigation-v123023328-d4155e40710.html' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '42': // Suspicious Detection
      return {
        id: '42',
        name: 'IS - Suspicious Detection',
        shortDescription: 'Suspicious file detection',
        fullDescription: 'Detects any suspicious files in your network based on the intensity level that is set in the Intensive Protection policy.',
        features: [
          'Suspicious file detection',
          'Intensive protection policy',
          'File analysis'
        ],
        useCases: [
          'Detect suspicious files',
          'Set protection intensity',
          'Analyze file behavior'
        ],
        competition: [
          'Microsoft',
          'PaloAlto',
          'SentinelOne',
          'Trellix',
          'Crowdstrike',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/endpoint-security/sescloud/Protection/antimalware-policy-advanced-settings-v128420816-d4155e13131/using-intensive-protection-settings-v119910353-d4155e29254.html' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '43': // Tamper Protection
      return {
        id: '43',
        name: 'Tamper Protection',
        shortDescription: 'Endpoint protection tampering prevention',
        fullDescription: 'SEP has powerful tamper protection that monitors SEP processes, files, and registry keys and prevents malware or users from disabling endpoint protection.',
        features: [
          'Tamper protection',
          'Process monitoring',
          'Registry key protection'
        ],
        useCases: [
          'Prevent tampering',
          'Monitor SEP processes',
          'Protect registry keys'
        ],
        competition: [
          'Microsoft',
          'PaloAlto',
          'SentinelOne',
          'Trellix',
          'Crowdstrike',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/endpoint-security/sescloud/Protection/about-tamper-protection-settings-v129409766-d4155e22442.html' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '44': // Threat Hunting
      return {
        id: '44',
        name: 'Threat Hunting',
        shortDescription: 'Automated threat hunting',
        fullDescription: 'Decades of threat intelligence and security experts automate threat hunting and provide additional customer-specific context.',
        features: [
          'Automated threat hunting',
          'Threat intelligence',
          'Customer-specific context'
        ],
        useCases: [
          'Automate threat hunting',
          'Leverage threat intelligence',
          'Provide customer-specific context'
        ],
        competition: [
          'Microsoft',
          'PaloAlto',
          'SentinelOne',
          'Trellix',
          'Crowdstrike',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://apidocs.securitycloud.symantec.com/#/doc?id=related_api' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '45': // TAA
      return {
        id: '45',
        name: 'TAA',
        shortDescription: 'Targeted attack analytics',
        fullDescription: 'SEDR provides precise detections from time-tested Targeted Attack Analytics, based on global activity of the good and the bad across all customer enterprises that comprise the telemetry set.',
        features: [
          'Targeted attack detection',
          'Global telemetry analysis',
          'Precise detections'
        ],
        useCases: [
          'Detect targeted attacks',
          'Analyze global telemetry',
          'Provide precise detections'
        ],
        competition: [
          'Microsoft',
          'PaloAlto',
          'SentinelOne',
          'Trellix',
          'Crowdstrike',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/endpoint-security/sescloud/Endpoint-Detection-and-Response/About-Incidents/about-targeted-attack-analytics-v134669993-d38e88773.html' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '46': // Sandboxing
      return {
        id: '46',
        name: 'Sandboxing',
        shortDescription: 'Malware analysis and sandboxing',
        fullDescription: 'Cynic is included in SES Complete. Cynic supports PE, Documents, and PS1, etc. Symantec has the option of on-prem Malware Analysis Appliance for on-prem EDR.',
        features: [
          'Malware analysis',
          'Sandboxing',
          'On-prem and cloud options'
        ],
        useCases: [
          'Analyze malware',
          'Sandbox suspicious files',
          'Deploy on-prem or cloud'
        ],
        competition: [
          'Microsoft',
          'PaloAlto',
          'SentinelOne',
          'Trellix',
          'Crowdstrike',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/endpoint-security/sescloud/Endpoint-Detection-and-Response.html' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '47': // EDR
      return {
        id: '47',
        name: 'EDR',
        shortDescription: 'Endpoint detection and response',
        fullDescription: 'Symantec EPP and EDR are both available for cloud, on-prem, and hybrid deployments.',
        features: [
          'Endpoint detection',
          'Response capabilities',
          'Cloud, on-prem, and hybrid deployment'
        ],
        useCases: [
          'Detect endpoint threats',
          'Respond to incidents',
          'Deploy on cloud, on-prem, or hybrid'
        ],
        competition: [
          'Microsoft',
          'PaloAlto',
          'SentinelOne',
          'Trellix',
          'Crowdstrike',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/endpoint-security/sescloud/Endpoint-Detection-and-Response.html' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '48': // SPE-NAS
      return {
        id: '48',
        name: 'SPE - NAS',
        shortDescription: 'Network-attached storage protection',
        fullDescription: 'Provides defense-in-depth protection of storage and protects sensitive data stored in centralized repositories from hackers and infection.',
        features: [
          'Storage protection',
          'Sensitive data protection',
          'Centralized repository security'
        ],
        useCases: [
          'Protect network-attached storage',
          'Secure sensitive data',
          'Prevent storage infections'
        ],
        competition: [
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/symantec-protection-engine/9-2-0/Related-Documents.html' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '49': // SPE-CS
      return {
        id: '49',
        name: 'SPE - CS',
        shortDescription: 'Cloud storage protection',
        fullDescription: 'Protects important business data and tools/utilities residing on storage devices that need malware protection.',
        features: [
          'Cloud storage protection',
          'Malware prevention',
          'Business data security'
        ],
        useCases: [
          'Protect cloud storage',
          'Prevent malware infections',
          'Secure business data'
        ],
        competition: [
          'AWS',
          'ClamAV',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/symantec-protection-engine/9-2-0/Related-Documents.html' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '50': // DCS
      return {
        id: '50',
        name: 'DCS',
        shortDescription: 'Data center security',
        fullDescription: 'Provides IDS, system hardening, logon/logoff monitoring, configuration monitoring, and least privilege access control.',
        features: [
          'Intrusion detection',
          'System hardening',
          'Configuration monitoring'
        ],
        useCases: [
          'Protect data centers',
          'Monitor system configurations',
          'Enforce least privilege access'
        ],
        competition: [
          'Trend Micro',
          'Trellix'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://techdocs.broadcom.com/us/en/symantec-security-software/endpoint-security-and-management/data-center-security-(dcs)/6-9-3.html' }
        ],
        category: 'Endpoint',
        isActive: true
      };

    case '60': // DX NetOps
      return {
        id: '60',
        name: 'DX NetOps',
        shortDescription: 'Provides network management, including events, fault management, performance monitoring, flow analysis, and configuration management.',
        fullDescription: 'Provides network management, including events, fault management, performance monitoring, flow analysis, and configuration management.',
        features: [
          'Network Events & Fault Management',
          'Network Performance Monitoring',
          'Network Flow Analysis',
          'Network Configuration Management'
        ],
        useCases: [
          'Monitor and manage network performance and faults.',
          'Analyze network flow and configurations.'
        ],
        competition: [
          'Solarwinds',
          'HP NNM',
          'Manage Engine'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Product Brief', url: 'https://docs.broadcom.com/doc/netops-product-brief' }
        ],
        category: 'AOD',
        isActive: true
      };

    case '61': // AppNeta
      return {
        id: '61',
        name: 'AppNeta',
        shortDescription: 'Provides synthetic network monitoring and digital experience monitoring.',
        fullDescription: 'Provides synthetic network monitoring and digital experience monitoring.',
        features: [
          'Hop-by-hop network path analysis.'
        ],
        useCases: [
          'Monitor network performance and digital experience.'
        ],
        competition: [
          'Cisco 1000E'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Product Brief', url: 'https://docs.broadcom.com/doc/appneta-sb' }
        ],
        category: 'AOD',
        isActive: true
      };

    case '62': // Clarity
      return {
        id: '62',
        name: 'Clarity',
        shortDescription: 'Provides project portfolio management (PPM) for centralized planning, resource optimization, and reporting.',
        fullDescription: 'Provides project portfolio management (PPM) for centralized planning, resource optimization, and reporting.',
        features: [
          'Centralized Planning and Prioritization',
          'Resource Optimization',
          'Reporting and Insights'
        ],
        useCases: [
          'Optimize project planning and resource allocation.',
          'Generate insights and reports for decision-making.'
        ],
        competition: [
          'Planview',
          'ServiceNow',
          'Microsoft Project'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Product Brief', url: 'https://docs.broadcom.com/doc/clarity-ppm-product-brief' }
        ],
        category: 'AOD',
        isActive: true
      };

    case '63': // Rally
      return {
        id: '63',
        name: 'Rally',
        shortDescription: 'Provides agile project management and software development lifecycle (SDLC) management.',
        fullDescription: 'Provides agile project management and software development lifecycle (SDLC) management.',
        features: [
          'Agile Development',
          'Release Planning & Management',
          'Defect Management & Quality Assurance'
        ],
        useCases: [
          'Manage agile software development projects.',
          'Plan releases and manage defects.'
        ],
        competition: [
          'Jira'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Product Brief', url: 'https://docs.broadcom.com/docs/rally-software-product-brief' }
        ],
        category: 'AOD',
        isActive: true
      };

    case '64': // Automic Automation
      return {
        id: '64',
        name: 'Automic Automation',
        shortDescription: 'Manages complex workloads across platforms, ERPs, and business apps spanning on-premises, hybrid, and multi-cloud environments.',
        fullDescription: 'Manages complex workloads across platforms, ERPs, and business apps spanning on-premises, hybrid, and multi-cloud environments.',
        features: [
          'Job Scheduling and Automation',
          'Workflow Automation',
          'IT Service Management (ITSM) Integration',
          'Cloud Automation',
          'API Integration',
          'Custom Scripting'
        ],
        useCases: [
          'Automate IT processes and workflows.',
          'Integrate with cloud and on-premises systems.'
        ],
        competition: [
          'BMC Control-M',
          'Stonebranch UAC'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://docs.broadcom.com/doc/12398023' }
        ],
        category: 'AOD',
        isActive: true
      };

    case '65': // Autosys Workload Automation
      return {
        id: '65',
        name: 'Autosys Workload Automation',
        shortDescription: 'Provides batch processing and data integration for automated data transfers, nightly reports, and data backup.',
        fullDescription: 'Provides batch processing and data integration for automated data transfers, nightly reports, and data backup.',
        features: [
          'Automated Data Transfers',
          'Nightly Reports & Analytics',
          'Data Backup & Recovery'
        ],
        useCases: [
          'Automate batch processing and data integration.',
          'Generate nightly reports and perform data backups.'
        ],
        competition: [
          'BMC Control-M',
          'IBM Workload Scheduler'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://docs.broadcom.com/doc/ca-workload-automation-ae' }
        ],
        category: 'AOD',
        isActive: true
      };

    case '66': // IMS
      return {
        id: '66',
        name: 'IMS',
        shortDescription: 'Information Management System',
        fullDescription: 'Mainframe-based hierarchical database and information management system.',
        features: [
          'Hierarchical database',
          'Transaction management',
          'Information management'
        ],
        useCases: [
          'Database management',
          'Transaction processing',
          'Information organization'
        ],
        competition: [
          'Oracle',
          'IBM Db2'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://docs.broadcom.com/doc/ims-product-brief' }
        ],
        category: 'IMS',
        isActive: true
      };

    case '67': // IMS Tools
      return {
        id: '67',
        name: 'IMS Tools',
        shortDescription: 'Database management tools',
        fullDescription: 'Comprehensive suite of tools for managing and maintaining IMS databases.',
        features: [
          'Database management',
          'System maintenance',
          'Performance optimization'
        ],
        useCases: [
          'Manage databases',
          'Maintain systems',
          'Optimize performance'
        ],
        competition: [
          'BMC',
          'IBM'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://docs.broadcom.com/doc/ims-tools-brief' }
        ],
        category: 'IMS',
        isActive: true
      };

    case '68': // IMS Database
      return {
        id: '68',
        name: 'IMS Database',
        shortDescription: 'High-performance database',
        fullDescription: 'High-performance hierarchical database for mission-critical applications.',
        features: [
          'High performance',
          'Data integrity',
          'Scalability'
        ],
        useCases: [
          'Mission-critical applications',
          'High-volume transactions',
          'Data management'
        ],
        competition: [
          'Oracle',
          'IBM Db2'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://docs.broadcom.com/doc/ims-db-brief' }
        ],
        category: 'IMS',
        isActive: true
      };

    case '69': // IMS Transaction Manager
      return {
        id: '69',
        name: 'IMS Transaction Manager',
        shortDescription: 'Transaction processing system',
        fullDescription: 'High-performance transaction processing system for mission-critical applications.',
        features: [
          'Transaction processing',
          'High availability',
          'System reliability'
        ],
        useCases: [
          'Process transactions',
          'Ensure high availability',
          'Maintain system reliability'
        ],
        competition: [
          'IBM CICS',
          'Oracle Tuxedo'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://docs.broadcom.com/doc/ims-tm-brief' }
        ],
        category: 'IMS',
        isActive: true
      };

    case '70': // CA Service Desk
      return {
        id: '70',
        name: 'CA Service Desk',
        shortDescription: 'A comprehensive ITSM tool for incident management, problem management, change management, and service catalog management.',
        fullDescription: 'A comprehensive ITSM tool for incident management, problem management, change management, and service catalog management.',
        features: [
          'Incident Management',
          'Problem Management',
          'Change Management',
          'Configuration Management',
          'Service Catalog',
          'Knowledge Management',
          'Self-Service Portal',
          'Automated Workflow and Incident Resolution',
          'Reports & Analytics',
          'Multi-Channel Support'
        ],
        useCases: [
          'Enterprise IT Operations: Minimize service interruptions and maximize customer satisfaction.',
          'Customer Support: Track, manage, and resolve customer issues across multiple channels.',
          'Cloud Service Management: Handle incidents, requests, and service tasks for cloud-based services.',
          'ITIL Framework Implementation: Align IT service practices with ITIL best practices.',
          'Compliance and Audit Management: Track and report service metrics for regulatory compliance.'
        ],
        competition: [
          'ServiceNow',
          'Freshservice',
          'Zendesk'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://docs.broadcom.com/doc/ca-service-desk-manager' }
        ],
        category: 'ITSM',
        isActive: true
      };

    case '77': // ITSM
      return {
        id: '77',
        name: 'CA Service Management',
        shortDescription: 'IT Service Management solutions',
        fullDescription: 'Comprehensive IT service management solution that helps organizations streamline service delivery, improve efficiency, and enhance user experience.',
        features: [
          'Service desk management',
          'Asset management',
          'Change management',
          'Knowledge management',
          'Self-service portal',
          'SLA management'
        ],
        useCases: [
          'IT service delivery optimization',
          'Asset lifecycle management',
          'Service catalog management',
          'Incident and problem resolution',
          'Change and release management'
        ],
        competition: [
          'ServiceNow',
          'BMC Helix',
          'Ivanti',
          'Cherwell'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://docs.broadcom.com/doc/ca-service-management' },
          { title: 'Solution Brief', url: 'https://docs.broadcom.com/doc/ca-service-management-solution-brief' }
        ],
        category: 'ITSM',
        isActive: true
      };

    // Proxy Products
    case '80': // CloudSOC CASB
      return {
        id: '80',
        name: 'CloudSOC CASB',
        shortDescription: 'Protects against data leaks from endpoints by identifying unsanctioned Shadow IT and risky applications.',
        fullDescription: 'Protects against data leaks from endpoints by identifying unsanctioned Shadow IT and risky applications.',
        features: [
          'Identifies and blocks risky applications and users.',
          'Provides visibility into unsanctioned cloud applications.'
        ],
        useCases: [
          'Prevent data leaks from endpoints.',
          'Identify and block risky applications and users.'
        ],
        competition: [
          'Forcepoint',
          'Zscaler',
          'Trend Micro'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Product Brief', url: 'https://docs.broadcom.com/doc/symantec-network-protection-product-brief' }
        ],
        category: 'Proxy',
        isActive: true
      };

    case '81': // Network Protection Suite (On-Premise)
      return {
        id: '81',
        name: 'Network Protection Suite (On-Premise)',
        shortDescription: 'Provides safe internet browsing and SSL/TLS interception over the internet.',
        fullDescription: 'Provides safe internet browsing and SSL/TLS interception over the internet.',
        features: [
          'Centralized management, reporting, and threat intelligence.',
          'SSL inspection, isolation, and CASB visibility and control.'
        ],
        useCases: [
          'Secure internet connectivity for corporate sites, branch offices, and remote locations.',
          'Protect networks, clients, and servers from malicious traffic.'
        ],
        competition: [
          'Zscaler',
          'Netskope',
          'Forcepoint'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Product Brief', url: 'https://docs.broadcom.com/doc/symantec-network-protection-product-brief' }
        ],
        category: 'Proxy',
        isActive: true
      };

    case '82': // Reverse Proxy
      return {
        id: '82',
        name: 'Reverse Proxy (Network Protection Suite)',
        shortDescription: 'Protects internally hosted web servers by securing and accelerating web applications and websites.',
        fullDescription: 'Protects internally hosted web servers by securing and accelerating web applications and websites.',
        features: [
          'Protection for web applications and websites hosted on-premises or in data centers.'
        ],
        useCases: [
          'Secure and accelerate internally hosted web applications.'
        ],
        competition: [
          'Zscaler',
          'Netskope',
          'Forcepoint'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Product Brief', url: 'https://docs.broadcom.com/doc/symantec-network-protection-product-brief' }
        ],
        category: 'Proxy',
        isActive: true
      };

    case '83': // Proxy on Cloud - SaaS
      return {
        id: '83',
        name: 'Proxy on Cloud - SaaS (Network Protection Suite)',
        shortDescription: 'Provides safe internet browsing and SSL/TLS interception over the internet in a cloud-based solution.',
        fullDescription: 'Provides safe internet browsing and SSL/TLS interception over the internet in a cloud-based solution.',
        features: [
          'Centralized management, reporting, and threat intelligence.',
          'SSL inspection, isolation, and CASB visibility and control.'
        ],
        useCases: [
          'Secure internet connectivity for corporate sites, branch offices, and remote locations.',
          'Protect networks, clients, and servers from malicious traffic.'
        ],
        competition: [
          'Zscaler',
          'Netskope',
          'Forcepoint'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Product Brief', url: 'https://docs.broadcom.com/doc/symantec-network-protection-product-brief' }
        ],
        category: 'Proxy',
        isActive: true
      };

    case '84': // Cloud Firewall Service - SaaS
      return {
        id: '84',
        name: 'Cloud Firewall Service - SaaS (Network Protection Suite)',
        shortDescription: 'Provides granular control over non-HTTP/HTTPS protocols with firewall policies in the cloud.',
        fullDescription: 'Provides granular control over non-HTTP/HTTPS protocols with firewall policies in the cloud.',
        features: [
          'Filter traffic based on user and layer four port.'
        ],
        useCases: [
          'Control non-web-based traffic in the cloud.'
        ],
        competition: [
          'Zscaler',
          'Netskope'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Product Brief', url: 'https://docs.broadcom.com/doc/symantec-network-protection-product-brief' }
        ],
        category: 'Proxy',
        isActive: true
      };

    case '85': // Deep File Inspection - Content Analysis (On-Premise)
      return {
        id: '85',
        name: 'Deep File Inspection - Content Analysis (On-Premise)',
        shortDescription: 'Provides content analysis to protect against threats from malicious URLs and downloads.',
        fullDescription: 'Provides content analysis to protect against threats from malicious URLs and downloads.',
        features: [
          'File-based malware detection and machine learning.'
        ],
        useCases: [
          'Protect against malicious URLs and downloads.'
        ],
        competition: [
          'Zscaler',
          'Netskope',
          'Forcepoint'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Product Brief', url: 'https://docs.broadcom.com/doc/symantec-network-protection-product-brief' }
        ],
        category: 'Proxy',
        isActive: true
      };

    case '86': // Deep File Inspection - Content Analysis (Cloud/SaaS)
      return {
        id: '86',
        name: 'Deep File Inspection - Content Analysis (Cloud/SaaS)',
        shortDescription: 'Provides content analysis to protect against threats from malicious URLs and downloads in a cloud-based solution.',
        fullDescription: 'Provides content analysis to protect against threats from malicious URLs and downloads in a cloud-based solution.',
        features: [
          'File-based malware detection and machine learning.'
        ],
        useCases: [
          'Protect against malicious URLs and downloads.'
        ],
        competition: [
          'Zscaler',
          'Netskope',
          'Forcepoint'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Product Brief', url: 'https://docs.broadcom.com/doc/symantec-network-protection-product-brief' }
        ],
        category: 'Proxy',
        isActive: true
      };

    case '87': // High Risk or Full Web Isolation
      return {
        id: '87',
        name: 'High Risk or Full Web Isolation (Network Protection Suite)',
        shortDescription: 'Protects against harmful and unknown web URL categories by executing web sessions away from endpoints.',
        fullDescription: 'Protects against harmful and unknown web URL categories by executing web sessions away from endpoints.',
        features: [
          'Execution of web sessions away from endpoints.',
          'Safe rendering of information to users\' browsers.'
        ],
        useCases: [
          'Prevent zero-day malware from reaching user devices.',
          'Isolate uncategorized or high-risk websites.'
        ],
        competition: [
          'Zscaler',
          'Netskope',
          'Forcepoint'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Product Brief', url: 'https://docs.broadcom.com/doc/symantec-network-protection-product-brief' }
        ],
        category: 'Proxy',
        isActive: true
      };

    case '88': // Malware Analysis - Only on SaaS
      return {
        id: '88',
        name: 'Malware Analysis - Only on SaaS (Network Protection Suite)',
        shortDescription: 'Provides sandboxing for unknown threats in a cloud-based solution.',
        fullDescription: 'Provides sandboxing for unknown threats in a cloud-based solution.',
        features: [
          'File-based malware detection, machine learning, and cloud-based sandboxing.'
        ],
        useCases: [
          'Detect and analyze unknown threats in the cloud.'
        ],
        competition: [
          'Zscaler',
          'Netskope',
          'Forcepoint'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Product Brief', url: 'https://docs.broadcom.com/doc/symantec-network-protection-product-brief' }
        ],
        category: 'Proxy',
        isActive: true
      };

    case '89': // ZTNA
      return {
        id: '89',
        name: 'ZTNA (Network Protection Suite)',
        shortDescription: 'Provides secure private access to resources hosted on-premise and SaaS.',
        fullDescription: 'Provides secure private access to resources hosted on-premise and SaaS.',
        features: [
          'Eliminates inbound connections to customer networks.',
          'Creates a software-defined perimeter (SDP) between users and applications.'
        ],
        useCases: [
          'Secure access to applications without VPNs.',
          'Make applications invisible to attackers.'
        ],
        competition: [
          'Zscaler',
          'Netskope'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Product Brief', url: 'https://docs.broadcom.com/doc/symantec-network-protection-product-brief' }
        ],
        category: 'Proxy',
        isActive: true
      };

    case '90': // SSLV
      return {
        id: '90',
        name: 'SSLV (SSL Visibility Appliance)',
        shortDescription: 'Provides SSL/TLS decryption for visibility into encrypted traffic.',
        fullDescription: 'Provides SSL/TLS decryption for visibility into encrypted traffic.',
        features: [
          'Identifies and decrypts SSL connections across all network ports.'
        ],
        useCases: [
          'Ensure attacks cannot slip by undetected in encrypted traffic.'
        ],
        competition: [
          'Gigamon'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Data Sheet', url: 'https://docs.broadcom.com/doc/SSL-Visibility-DS' }
        ],
        category: 'Proxy',
        isActive: true
      };

    // IMS (Identity Management Solutions) Products
    case '100': // Security Analytics
      return {
        id: '100',
        name: 'Security Analytics',
        shortDescription: 'Improves network visibility, inspection, and forensics to accelerate incident response and remediation.',
        fullDescription: 'Improves network visibility, inspection, and forensics to accelerate incident response and remediation.',
        features: [
          'Threat Hunting',
          'Network Visibility',
          'Forensics and Incident Response'
        ],
        useCases: [
          'Accelerate incident response and remediation.',
          'Improve network visibility and inspection.'
        ],
        competition: [
          'Qradar',
          'Vehere',
          'ExtraHop'
        ],
        subscriptionType: 'Hardware and Subscription',
        whitepaperLinks: [
          { title: 'Product Brief', url: 'https://www.broadcom.com/products/cybersecurity/network/forensics-security-analytics' }
        ],
        category: 'IMS',
        isActive: true
      };

    case '101': // SMG / ESS (Email Security)
      return {
        id: '101',
        name: 'SMG / ESS (Email Security)',
        shortDescription: 'Provides email protection and antispam capabilities.',
        fullDescription: 'Provides email protection and antispam capabilities.',
        features: [
          'Email protection',
          'Antispam'
        ],
        useCases: [
          'Protect against email threats and spam.'
        ],
        competition: [
          'Proofpoint',
          'Barracuda',
          'Trend Micro',
          'Trellix'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [],
        category: 'IMS',
        isActive: true
      };

    case '102': // PGP Endpoint
      return {
        id: '102',
        name: 'PGP Endpoint',
        shortDescription: 'Provides drive encryption and whole disk encryption for data protection.',
        fullDescription: 'Provides drive encryption and whole disk encryption for data protection.',
        features: [
          'Drive Encryption',
          'Whole Disk Encryption'
        ],
        useCases: [
          'Protect sensitive data on endpoints.'
        ],
        competition: [
          'Trellix',
          'ServiceNow'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [],
        category: 'IMS',
        isActive: true
      };

    case '103': // VIP (Multifactor Authentication)
      return {
        id: '103',
        name: 'VIP (Multifactor Authentication)',
        shortDescription: 'Provides multifactor authentication for application protection.',
        fullDescription: 'Provides multifactor authentication for application protection.',
        features: [
          'Multifactor Authentication'
        ],
        useCases: [
          'Secure access to applications with MFA.'
        ],
        competition: [
          'Mic'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [],
        category: 'IMS',
        isActive: true
      };

    case '104': // SiteMinder
      return {
        id: '104',
        name: 'SiteMinder',
        shortDescription: 'Provides authentication and single sign-on (SSO) capabilities.',
        fullDescription: 'Provides authentication and single sign-on (SSO) capabilities.',
        features: [
          'SSO',
          'OAUTH',
          'SAML'
        ],
        useCases: [
          'Secure access to applications with SSO and SAML.'
        ],
        competition: [
          'ForgeRock',
          'ADFS',
          'Ping Access'
        ],
        subscriptionType: 'Perm/Subscription',
        whitepaperLinks: [],
        category: 'IMS',
        isActive: true
      };

    case '105': // VIP Authentication Hub
      return {
        id: '105',
        name: 'VIP Authentication Hub',
        shortDescription: 'Provides authentication with SSO, OAUTH, SAML, FIDO2, MFA, and risk-based authentication.',
        fullDescription: 'Provides authentication with SSO, OAUTH, SAML, FIDO2, MFA, and risk-based authentication.',
        features: [
          'SSO',
          'OAUTH',
          'SAML',
          'FIDO2',
          'MFA',
          'Risk-Based Authentication'
        ],
        useCases: [
          'Secure access to applications with advanced authentication methods.'
        ],
        competition: [
          'Okta',
          'Auth0',
          'Ping Identity',
          'EntraID'
        ],
        subscriptionType: 'Perm/Subscription',
        whitepaperLinks: [],
        category: 'IMS',
        isActive: true
      };

    case '106': // VIP SaaS
      return {
        id: '106',
        name: 'VIP SaaS',
        shortDescription: 'Provides cloud-based authentication with SSO, OAUTH, SAML, FIDO2, and MFA.',
        fullDescription: 'Provides cloud-based authentication with SSO, OAUTH, SAML, FIDO2, and MFA.',
        features: [
          'SSO',
          'OAUTH',
          'SAML',
          'FIDO2',
          'MFA'
        ],
        useCases: [
          'Secure access to cloud applications with MFA and SSO.'
        ],
        competition: [
          'Okta',
          'Auth0',
          'Ping Identity',
          'EntraID'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [],
        category: 'IMS',
        isActive: true
      };

    case '107': // Advanced Authentication
      return {
        id: '107',
        name: 'Advanced Authentication',
        shortDescription: 'Provides authentication with SSO and MFA.',
        fullDescription: 'Provides authentication with SSO and MFA.',
        features: [
          'SSO',
          'MFA'
        ],
        useCases: [
          'Secure access to applications with SSO and MFA.'
        ],
        competition: [
          'Okta',
          'EntraID',
          'Cisco Duo'
        ],
        subscriptionType: 'Perm/Subscription',
        whitepaperLinks: [],
        category: 'IMS',
        isActive: true
      };

    case '108': // Identity Suite
      return {
        id: '108',
        name: 'Identity Suite',
        shortDescription: 'Provides identity management and governance, including identity lifecycle management, user provisioning, and identity governance.',
        fullDescription: 'Provides identity management and governance, including identity lifecycle management, user provisioning, and identity governance.',
        features: [
          'Identity Lifecycle Management',
          'Identity Governance',
          'User Service Portal',
          'User Provisioning'
        ],
        useCases: [
          'Manage identity lifecycle and governance.',
          'Provision users and manage access.'
        ],
        competition: [
          'Sailpoint',
          'Azure AD',
          'Ping Identity'
        ],
        subscriptionType: 'Perm/Subscription',
        whitepaperLinks: [],
        category: 'IMS',
        isActive: true
      };

    case '109': // PAM (Password Management)
      return {
        id: '109',
        name: 'PAM (Password Management)',
        shortDescription: 'Provides password vault and privilege access management.',
        fullDescription: 'Provides password vault and privilege access management.',
        features: [
          'Password Vault',
          'Privilege Access Management'
        ],
        useCases: [
          'Secure privileged access and manage passwords.'
        ],
        competition: [
          'Cyberark',
          'Hashcorp'
        ],
        subscriptionType: 'Perm/Subscription',
        whitepaperLinks: [],
        category: 'IMS',
        isActive: true
      };

    case '110': // CA Directory
      return {
        id: '110',
        name: 'CA Directory',
        shortDescription: 'Provides user directory services.',
        fullDescription: 'Provides user directory services.',
        features: [
          'User Directory'
        ],
        useCases: [
          'Manage user directories for authentication and access.'
        ],
        competition: [
          'RHDS',
          'AD',
          'Oracle DSEE',
          'OpenLDAP'
        ],
        subscriptionType: 'Perm/Subscription',
        whitepaperLinks: [],
        category: 'IMS',
        isActive: true
      };

    default:
      return {
        id,
        name: `Product ${id}`,
        shortDescription: "A short description of the product",
        fullDescription: "This is a detailed description of the product that explains all its features and benefits in depth. It provides comprehensive information about what the product does, how it works, and why it's valuable.",
        features: [
          "Advanced security features",
          "Cloud-based administration",
          "Real-time monitoring",
          "Automated backups",
          "Multi-factor authentication"
        ],
        competition: [
          "Competitor X",
          "Competitor Y",
          "Competitor Z"
        ],
        useCases: [
          "Enterprise security",
          "Network management",
          "Data protection"
        ],
        subscriptionType: "Subscription",
        whitepaperLinks: [
          { title: "Technical Overview", url: "https://example.com/tech-overview" },
          { title: "Security Whitepaper", url: "https://example.com/security-paper" }
        ],
        category: "Network Security",
        isActive: true
      };
  }
};

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  // For switching between view and edit mode
  const [isEditing, setIsEditing] = useState(isNew);
  
  // Track whitepaper links state
  const [whitepaperLinks, setWhitepaperLinks] = useState<Array<{title: string, url: string}>>([]);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  
  // For form loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetchProductDetails(id || 'new'),
    enabled: !!id
  });
  
  // Set up form with react-hook-form
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      shortDescription: '',
      fullDescription: '',
      category: '',
      subscriptionType: '',
      isActive: true,
      whitepaperLinks: [],
    },
  });
  
  // Update form values when product data is loaded
  React.useEffect(() => {
    console.log("Product data loaded:", product);
    if (product && !isLoading) {
      form.reset({
        name: product.name,
        shortDescription: product.shortDescription,
        fullDescription: product.fullDescription,
        category: product.category,
        subscriptionType: product.subscriptionType,
        isActive: product.isActive,
        whitepaperLinks: product.whitepaperLinks,
      });
      
      setWhitepaperLinks(product.whitepaperLinks || []);
    }
  }, [product, isLoading, form]);
  
  const addWhitepaperLink = () => {
    if (newLinkTitle && newLinkUrl) {
      const newLinks = [...whitepaperLinks, { title: newLinkTitle, url: newLinkUrl }];
      setWhitepaperLinks(newLinks);
      form.setValue('whitepaperLinks', newLinks);
      setNewLinkTitle('');
      setNewLinkUrl('');
    }
  };
  
  const removeWhitepaperLink = (index: number) => {
    const newLinks = [...whitepaperLinks];
    newLinks.splice(index, 1);
    setWhitepaperLinks(newLinks);
    form.setValue('whitepaperLinks', newLinks);
  };
  
  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    try {
      setIsSubmitting(true);
      console.log('Form values to submit:', values);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(
        `Product ${isNew ? 'created' : 'updated'} successfully`,
        { description: `${values.name} has been ${isNew ? 'added to' : 'updated in'} your product catalog.` }
      );
      
      if (isNew) {
        navigate('/products');
      } else {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(
        `Error ${isNew ? 'creating' : 'updating'} product`,
        { description: `There was an error ${isNew ? 'creating' : 'updating'} the product.` }
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4 max-w-7xl">
        <Button 
          variant="ghost" 
          className="mb-4 sm:mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
          <div>
            <Skeleton className="h-8 sm:h-10 md:h-12 w-full sm:w-3/4 mb-2 sm:mb-4" />
            <Skeleton className="h-4 sm:h-5 md:h-6 w-full mb-2" />
            <Skeleton className="h-4 sm:h-5 md:h-6 w-full sm:w-2/3 mb-4 sm:mb-6 md:mb-8" />
            <Skeleton className="h-32 sm:h-36 md:h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  // Show error message
  if (error || !product) {
    return (
      <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4 text-center max-w-3xl">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Error loading product</h2>
        <p className="text-muted-foreground mb-4 sm:mb-6">
          We couldn't find the product you're looking for.
        </p>
        <Button onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }
  
  // Render form for new/edit product
  if (isNew || isEditing) {
    return (
      <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
          <Button 
            variant="ghost" 
            onClick={() => isNew ? navigate('/products') : setIsEditing(false)}
            className="w-full sm:w-auto"
          >
            <ArrowLeft size={16} className="mr-2" />
            {isNew ? 'Back to Products' : 'Cancel Editing'}
          </Button>
          <h1 className="text-xl sm:text-2xl font-semibold">{isNew ? 'Create New Product' : 'Edit Product'}</h1>
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">{isNew ? 'Product Details' : `Editing: ${product.name}`}</CardTitle>
            <CardDescription>
              Fill in the information below to {isNew ? 'create a new product' : 'update this product'}.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        The name of your product as it will appear to customers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the product" 
                          {...field} 
                          className="min-h-[80px] sm:min-h-[100px]"
                        />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        A concise summary that will appear in product listings.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fullDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed description of the product" 
                          className="min-h-[120px] sm:min-h-[150px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-xs sm:text-sm">
                        Comprehensive details about your product's features and benefits.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sampleCategories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs sm:text-sm">
                          The category this product belongs to.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subscriptionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subscription type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Subscription">Subscription</SelectItem>
                            <SelectItem value="One-time">One-time Purchase</SelectItem>
                            <SelectItem value="Free">Free</SelectItem>
                            <SelectItem value="Trial">Free Trial</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs sm:text-sm">
                          The subscription model for this product.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Whitepaper Links Section */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-medium">Whitepaper Links</h3>
                  <div className="border rounded-md p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {whitepaperLinks.map((link, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-2 space-y-2 sm:space-y-0">
                        <div className="truncate">
                          <p className="font-medium text-sm sm:text-base">{link.title}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">{link.url}</p>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeWhitepaperLink(index)}
                          className="self-end sm:self-auto"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <Input
                        placeholder="Link Title"
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        placeholder="URL (https://...)"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addWhitepaperLink}
                      disabled={!newLinkTitle || !newLinkUrl}
                      className="w-full sm:w-auto"
                    >
                      <Link size={16} className="mr-2" />
                      Add Whitepaper Link
                    </Button>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 sm:p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm sm:text-base">Product Status</FormLabel>
                        <FormDescription className="text-xs sm:text-sm">
                          Set whether this product is currently active and visible to customers.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => isNew ? navigate('/products') : setIsEditing(false)}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto order-1 sm:order-2"
                  >
                    {isSubmitting ? 'Saving...' : isNew ? 'Create Product' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Render product details view
  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4 max-w-6xl">
      <Button 
        variant="ghost" 
        className="mb-4 sm:mb-6" 
        onClick={() => navigate('/products')}
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Products
      </Button>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-semibold">{product.name}</h1>
        {/* Edit Product button removed */}
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {product.category && (
              <Badge variant="outline">{product.category}</Badge>
            )}
            {product.subscriptionType && (
              <Badge>{product.subscriptionType}</Badge>
            )}
            {!product.isActive && (
              <Badge variant="destructive">Unavailable</Badge>
            )}
          </div>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-6">
            {product.shortDescription}
          </p>
          
          <Tabs defaultValue="overview" className="mb-6 sm:mb-8">
            <TabsList className="inline-flex border-b rounded-none bg-muted/40 mb-4 ml-0">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="competition">Competition</TabsTrigger>
              <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4 mt-4 sm:mt-6">
              <div>
                <h3 className="text-base sm:text-lg font-medium mb-2">Description</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{product.fullDescription}</p>
              </div>
              
              {product.competition && product.competition.length > 0 && (
                <div>
                  <h3 className="text-base sm:text-lg font-medium mb-2">Competition</h3>
                  <ul className="list-disc list-inside text-sm sm:text-base text-muted-foreground">
                    {product.competition.map((competitor, index) => (
                      <li key={index}>{competitor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4 mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-medium mb-2">Key Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {product.features && product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 sm:mr-3 mt-0.5">
                      <Layers size={14} className="text-primary sm:w-4 sm:h-4" />
                    </div>
                    <div>
                      <p className="text-sm sm:text-base">{feature}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="competition" className="space-y-4 mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-medium mb-2">Competitors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {product.competition && product.competition.map((competitor, index) => (
                  <Card key={index} className="bg-background/50">
                    <CardContent className="p-3 sm:p-4">
                      <h4 className="font-medium text-sm sm:text-base">{competitor}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="use-cases" className="space-y-4 mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-medium mb-2">Common Use Cases</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {product.useCases && product.useCases.map((useCase, index) => (
                  <Card key={index} className="bg-background/50">
                    <CardContent className="p-3 sm:p-4 sm:pt-5">
                      <h4 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">{useCase}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Implementation example for {useCase.toLowerCase()}.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="documentation" className="space-y-4 mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-medium mb-2">Whitepapers & Documentation</h3>
              {product.whitepaperLinks && product.whitepaperLinks.length > 0 ? (
                <div className="space-y-3">
                  {product.whitepaperLinks.map((link, index) => (
                    <Card key={index} className="bg-background/50">
                      <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div className="flex items-start sm:items-center">
                          <FileText size={18} className="mr-3 text-purple-600 flex-shrink-0 mt-1 sm:mt-0" />
                          <div className="w-full overflow-hidden">
                            <h4 className="font-medium text-sm sm:text-base">{link.title}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-md">
                              {link.url}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(link.url, '_blank')}
                          className="self-end sm:self-auto"
                        >
                          View
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm sm:text-base text-muted-foreground">No documentation available for this product.</p>
              )}
            </TabsContent>
          </Tabs>
          
          <Separator className="my-6 sm:my-8" />
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => navigate('/products')}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Products
            </Button>
            
            {product.whitepaperLinks && product.whitepaperLinks.length > 0 && (
              <Button 
                onClick={() => window.open(product.whitepaperLinks[0].url, '_blank')}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                <FileText size={16} className="mr-2" />
                View Documentation
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;
