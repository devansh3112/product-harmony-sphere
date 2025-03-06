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
      clients: [],
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
    case '30': // Endpoint DLP
      return {
        id: '30',
        name: 'Endpoint DLP',
        shortDescription: 'Protect sensitive data on endpoints',
        fullDescription: 'Symantec Endpoint DLP lets you identify sensitive information on endpoints and regulate its flow.',
        features: [
          'Sensitive data identification',
          'Data flow monitoring',
          'Endpoint protection'
        ],
        useCases: [
          'Prevent data leakage',
          'Monitor sensitive information',
          'Regulate data transfer',
          'Protect confidential files'
        ],
        competition: [
          'Forcepoint',
          'Zscaler',
          'Trend Micro'
        ],
        clients: [
          'Aditya Birla Group',
          'Ciinfotech'
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
        name: 'Network DLP',
        shortDescription: 'Network-based data loss prevention',
        fullDescription: 'Network DLP captures and analyzes traffic on network, detecting confidential data and traffic metadata over specified protocols.',
        features: [
          'Traffic analysis',
          'Confidential data detection',
          'Protocol monitoring'
        ],
        useCases: [
          'Detect confidential data transfer',
          'Monitor network traffic',
          'Prevent data exfiltration'
        ],
        competition: [
          'Forcepoint',
          'Zscaler',
          'Trend Micro'
        ],
        clients: [
          'Aditya Birla Group',
          'Ciinfotech',
          'Softcell'
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
        name: 'Storage DLP',
        shortDescription: 'Data loss prevention for storage',
        fullDescription: 'DLP is a set of technologies, products, and techniques that are designed to stop sensitive information from leaving an organization.',
        features: [
          'Data discovery',
          'Data protection',
          'Storage scanning'
        ],
        useCases: [
          'Identify exposed confidential data',
          'Secure sensitive information',
          'Prevent data loss'
        ],
        competition: [
          'Forcepoint',
          'Zscaler'
        ],
        clients: [
          'Aditya Birla Group',
          'Ciinfotech'
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
        name: 'CASB DLP',
        shortDescription: 'Cloud-based data loss prevention',
        fullDescription: 'DLP helps you understand how your sensitive information is being used, including what data is being handled and by whom.',
        features: [
          'Cloud application scanning',
          'Real-time monitoring',
          'Data protection'
        ],
        useCases: [
          'Monitor cloud applications',
          'Protect sensitive data',
          'Prevent data loss in the cloud'
        ],
        competition: [
          'Forcepoint',
          'Zscaler'
        ],
        clients: [
          'Aditya Birla Group',
          'Ciinfotech',
          'Softcell'
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
        clients: [
          'Infosys',
          'HCL',
          'ICICI',
          'HDFC',
          'Axis Bank',
          'Vodafone',
          'PNB',
          'SBI Life',
          'Canara Bank'
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
        clients: [
          'HCL',
          'PNB',
          'Axis Bank',
          'Infosys'
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
        clients: [
          'Axis Bank (In Progress)'
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
        clients: [
          'Infosys',
          'HCL',
          'ICICI',
          'HDFC',
          'Axis Bank',
          'Vodafone',
          'PNB',
          'SBI Life',
          'Canara Bank'
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
        clients: [
          'Infosys',
          'HCL',
          'ICICI',
          'HDFC',
          'Axis Bank',
          'Vodafone',
          'PNB',
          'SBI Life',
          'Canara Bank'
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
        clients: [
          'Infosys',
          'HCL',
          'ICICI',
          'HDFC',
          'Axis Bank',
          'Vodafone',
          'PNB',
          'SBI Life',
          'Canara Bank'
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
        clients: [
          'PNB'
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
        clients: [
          'Infosys',
          'HCL',
          'ICICI',
          'HDFC',
          'Axis Bank',
          'Vodafone',
          'PNB',
          'SBI Life',
          'Canara Bank'
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
        clients: [
          'Infosys',
          'HCL',
          'ICICI',
          'HDFC',
          'Axis Bank',
          'Vodafone',
          'PNB',
          'SBI Life',
          'Canara Bank'
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
        clients: [
          'Infosys',
          'HCL',
          'ICICI',
          'HDFC',
          'Axis Bank',
          'Vodafone',
          'PNB',
          'SBI Life',
          'Canara Bank'
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
        clients: [
          'Axis Bank',
          'HCL'
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
        clients: [
          'PNB',
          'Axis Bank',
          'Canara Bank'
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
        clients: [
          'PNB',
          'Axis Bank',
          'Canara Bank'
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
        clients: [
          'PNB',
          'Axis Bank',
          'Canara Bank'
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
        clients: [
          'Axis Bank',
          'HDFC',
          'Infosys'
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
        clients: [
          'HCL'
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
        clients: [
          'PNB',
          'Axis Bank',
          'HCL'
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
        shortDescription: 'Network management and monitoring',
        fullDescription: 'Network events, fault management, performance monitoring, and configuration management.',
        features: [
          'Network events tracking',
          'Performance monitoring',
          'Network flow analysis'
        ],
        useCases: [
          'Network performance optimization',
          'Fault management',
          'Configuration tracking'
        ],
        competition: [
          'Solarwinds',
          'HP NNM',
          'Manage Engine'
        ],
        clients: [
          'Wipro',
          'Infosys',
          'Bank Of Maharashtra',
          'India Department of Post'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://docs.broadcom.com/doc/netops-product-brief' }
        ],
        category: 'AOD',
        isActive: true
      };

    case '61': // AppNeta
      return {
        id: '61',
        name: 'AppNeta',
        shortDescription: 'Synthetic network monitoring',
        fullDescription: 'Digital Experience Monitoring with hop-by-hop network path analysis.',
        features: [
          'Digital experience monitoring',
          'Network path analysis',
          'Synthetic monitoring'
        ],
        useCases: [
          'Monitor digital experience',
          'Analyze network paths',
          'Synthetic network monitoring'
        ],
        competition: [
          'Cisco 1000E'
        ],
        clients: [
          'EXL Service'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://docs.broadcom.com/doc/appneta-sb' }
        ],
        category: 'AOD',
        isActive: true
      };

    case '62': // Clarity
      return {
        id: '62',
        name: 'Clarity',
        shortDescription: 'Project portfolio management',
        fullDescription: 'Centralized planning and prioritization, resource optimization, reporting, and insights.',
        features: [
          'Centralized planning',
          'Resource optimization',
          'Reporting and insights'
        ],
        useCases: [
          'Plan and prioritize projects',
          'Optimize resources',
          'Generate reports and insights'
        ],
        competition: [
          'Planview',
          'ServiceNow',
          'Microsoft Project'
        ],
        clients: [
          'HCL',
          'Infosys'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://docs.broadcom.com/doc/clarity-ppm-product-brief' }
        ],
        category: 'AOD',
        isActive: true
      };

    case '63': // Rally
      return {
        id: '63',
        name: 'Rally',
        shortDescription: 'Agile project management',
        fullDescription: 'Agile development, release planning & management, defect management & quality assurance.',
        features: [
          'Agile development',
          'Release planning',
          'Defect management'
        ],
        useCases: [
          'Manage agile projects',
          'Plan and manage releases',
          'Ensure quality assurance'
        ],
        competition: [
          'Jira'
        ],
        clients: [
          'HCL',
          'Infosys'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://docs.broadcom.com/docs/rally-software-product-brief' }
        ],
        category: 'AOD',
        isActive: true
      };

    case '64': // Automic Automation
      return {
        id: '64',
        name: 'Automic Automation',
        shortDescription: 'IT process automation',
        fullDescription: 'Manage complex workloads across platforms, ERPs, and business apps spanning on-premises, hybrid, and multi-cloud environments.',
        features: [
          'Workload automation',
          'Cross-platform management',
          'Cloud automation'
        ],
        useCases: [
          'Automate IT processes',
          'Manage complex workloads',
          'Integrate across platforms'
        ],
        competition: [
          'BMC Control-M',
          'Stonebranch UAC'
        ],
        clients: [
          'Infosys',
          'Wipro'
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
        shortDescription: 'Batch processing and data integration',
        fullDescription: 'Automated data transfers, nightly reports & analytics, data backup & recovery.',
        features: [
          'Batch processing',
          'Data integration',
          'Automated data transfers'
        ],
        useCases: [
          'Automate data transfers',
          'Generate nightly reports',
          'Backup and recover data'
        ],
        competition: [
          'BMC Control-M',
          'IBM Workload Scheduler'
        ],
        clients: [
          'SBI',
          'HDFC',
          'Aditya Birla Sun Life'
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
        clients: [
          'SBI',
          'Bank Of Baroda'
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
        clients: [
          'SBI',
          'Bank Of Baroda'
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
        clients: [
          'SBI',
          'Bank Of Baroda'
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
        clients: [
          'SBI',
          'Bank Of Baroda'
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
        shortDescription: 'Comprehensive IT service management platform',
        fullDescription: 'Helps IT teams manage incidents, problems, changes, and service requests efficiently.',
        features: [
          'Incident management',
          'Problem management',
          'Change management',
          'Self-service portal'
        ],
        useCases: [
          'IT operations efficiency',
          'Service interruption management',
          'Customer support tracking'
        ],
        competition: [
          'ServiceNow',
          'Freshservice',
          'Zendesk'
        ],
        clients: [],
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
        clients: [
          'Major Financial Institutions',
          'Healthcare Organizations',
          'Government Agencies'
        ],
        subscriptionType: 'Subscription',
        whitepaperLinks: [
          { title: 'Technical Documentation', url: 'https://docs.broadcom.com/doc/ca-service-management' },
          { title: 'Solution Brief', url: 'https://docs.broadcom.com/doc/ca-service-management-solution-brief' }
        ],
        category: 'ITSM',
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
        clients: [
          "Company A",
          "Company B",
          "Company C"
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
  
  const { data: product, isLoading, error } = useQuery({
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
      <div className="container mx-auto py-12 px-4">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        
        <div className="grid grid-cols-1 gap-8">
          <div>
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-2/3 mb-8" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  // Show error message
  if (error || !product) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Error loading product</h2>
        <p className="text-muted-foreground mb-6">
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
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => isNew ? navigate('/products') : setIsEditing(false)}
          >
            <ArrowLeft size={16} className="mr-2" />
            {isNew ? 'Back to Products' : 'Cancel Editing'}
          </Button>
          <h1 className="text-2xl font-semibold">{isNew ? 'Create New Product' : 'Edit Product'}</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{isNew ? 'Product Details' : `Editing: ${product.name}`}</CardTitle>
            <CardDescription>
              Fill in the information below to {isNew ? 'create a new product' : 'update this product'}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormDescription>
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
                        />
                      </FormControl>
                      <FormDescription>
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
                          className="min-h-[150px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Comprehensive details about your product's features and benefits.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <FormDescription>
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
                        <FormDescription>
                          The subscription model for this product.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Whitepaper Links Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Whitepaper Links</h3>
                  <div className="border rounded-md p-4 space-y-4">
                    {whitepaperLinks.map((link, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">{link.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeWhitepaperLink(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Link Title"
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                      />
                      <Input
                        placeholder="URL (https://...)"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addWhitepaperLink}
                      disabled={!newLinkTitle || !newLinkUrl}
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Product Status</FormLabel>
                        <FormDescription>
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
                
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => isNew ? navigate('/products') : setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
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
    <div className="container mx-auto py-12 px-4">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate('/products')}
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Products
      </Button>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <Button onClick={() => setIsEditing(true)}>
          Edit Product
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
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
          
          <p className="text-xl text-muted-foreground mb-6">
            {product.shortDescription}
          </p>
          
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{product.fullDescription}</p>
              </div>
              
              {product.competition && product.competition.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Competition</h3>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {product.competition.map((competitor, index) => (
                      <li key={index}>{competitor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Key Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features && product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <Layers size={16} className="text-primary" />
                    </div>
                    <div>
                      <p>{feature}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="use-cases" className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Common Use Cases</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.useCases && product.useCases.map((useCase, index) => (
                  <Card key={index} className="bg-background/50">
                    <CardContent className="pt-6">
                      <h4 className="font-medium mb-2">{useCase}</h4>
                      <p className="text-sm text-muted-foreground">
                        Implementation example for {useCase.toLowerCase()}.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="clients" className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Client Success Stories</h3>
              <div className="space-y-4">
                {product.clients && product.clients.map((client, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                      <Users size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium">{client}</h4>
                      <p className="text-sm text-muted-foreground">
                        Successfully implemented {product.name} for their operations.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="documentation" className="space-y-4">
              <h3 className="text-lg font-medium mb-2">Whitepapers & Documentation</h3>
              {product.whitepaperLinks && product.whitepaperLinks.length > 0 ? (
                <div className="space-y-3">
                  {product.whitepaperLinks.map((link, index) => (
                    <Card key={index} className="bg-background/50">
                      <CardContent className="pt-4 pb-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <FileText size={20} className="mr-3 text-purple-600" />
                          <div>
                            <h4 className="font-medium">{link.title}</h4>
                            <p className="text-sm text-muted-foreground truncate max-w-md">
                              {link.url}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          View
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No documentation available for this product.</p>
              )}
            </TabsContent>
          </Tabs>
          
          <Separator className="my-8" />
          
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/products')}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Products
            </Button>
            
            {product.whitepaperLinks && product.whitepaperLinks.length > 0 && (
              <Button onClick={() => window.open(product.whitepaperLinks[0].url, '_blank')}>
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
