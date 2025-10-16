import { Component } from '@angular/core';

interface HeuristicIssue {
  id: number;
  heuristic: string;
  heuristicNumber: string;
  issue: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
  evidence: string;
  solution: string;
  demoRoute: string;
  icon: string;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  issues: HeuristicIssue[] = [
    {
      id: 1,
      heuristic: 'Help users recognize, diagnose, and recover from errors',
      heuristicNumber: 'Heuristic #9',
      issue: 'Generic Error Messages',
      description: 'ISC Portal displays vague error messages like "An error occurred" without actionable recovery steps or error codes.',
      impact: 'High',
      effort: 'Medium',
      evidence: '"Errors are not helpful" - Employee Survey',
      solution: 'Structured error messages with error codes, timestamps, and clear recovery actions',
      demoRoute: '/assets/demos/index.html',
      icon: 'error_outline'
    },
    {
      id: 2,
      heuristic: 'Aesthetic and minimalist design',
      heuristicNumber: 'Heuristic #8',
      issue: 'No Empty States',
      description: 'Tables show blank screens when no data is available, leaving users confused about whether the system is working.',
      impact: 'High',
      effort: 'Low',
      evidence: 'Focus group participants reported confusion with "blank screens"',
      solution: 'Contextual empty states with helpful messages and next action suggestions',
      demoRoute: '/sites-unified',
      icon: 'inbox'
    },
    {
      id: 3,
      heuristic: 'Visibility of system status',
      heuristicNumber: 'Heuristic #1',
      issue: 'Missing Sites and Circuits',
      description: 'Sites and circuits are not showing up in the portal, and there\'s no indication of data sync status or last update time.',
      impact: 'High',
      effort: 'High',
      evidence: '81% of employees report "system issues" - Q2 2025 Survey',
      solution: 'Data sync indicators, last update timestamps, and refresh status',
      demoRoute: '/circuits',
      icon: 'sync_problem'
    },
    {
      id: 4,
      heuristic: 'User control and freedom',
      heuristicNumber: 'Heuristic #3',
      issue: 'No Bulk Actions',
      description: 'Users must perform actions one-by-one on sites and circuits, making large operations extremely time-consuming.',
      impact: 'High',
      effort: 'Medium',
      evidence: 'Requested in focus groups: "Need bulk export and bulk delete"',
      solution: 'Bulk selection with multi-action toolbar (export, delete, update status)',
      demoRoute: '/contacts',
      icon: 'checklist'
    },
    {
      id: 5,
      heuristic: 'Error prevention',
      heuristicNumber: 'Heuristic #5',
      issue: 'No Delete Confirmation',
      description: 'Critical destructive actions like deleting sites have no confirmation dialog, leading to accidental data loss.',
      impact: 'High',
      effort: 'Low',
      evidence: 'Focus group: "I accidentally deleted something and couldn\'t undo it"',
      solution: 'Confirmation dialogs for destructive actions with clear impact warning',
      demoRoute: '/contacts',
      icon: 'warning'
    },
    {
      id: 6,
      heuristic: 'Consistency and standards',
      heuristicNumber: 'Heuristic #4',
      issue: 'Inconsistent Button Hierarchy',
      description: 'Multiple different blues used inconsistently across the portal - "4 blues problem" makes it unclear which actions are primary.',
      impact: 'Medium',
      effort: 'Low',
      evidence: 'Design system analysis identified 4 different blue values: #102F65, #294474, #0D62FF, #0A4ECC',
      solution: 'Material Design 3 systematic color system with single primary blue (#0D62FF)',
      demoRoute: '/dashboard',
      icon: 'palette'
    },
    {
      id: 7,
      heuristic: 'Help and documentation',
      heuristicNumber: 'Heuristic #10',
      issue: 'Missing Documentation for UCaaS Reports',
      description: 'UCaaS report generation feature has no tooltips, help text, or documentation on how to use it.',
      impact: 'Medium',
      effort: 'Low',
      evidence: 'Focus group: "How do I generate UCaaS reports? There\'s no help"',
      solution: 'Contextual help tooltips and inline documentation',
      demoRoute: '/dashboard',
      icon: 'help_outline'
    },
    {
      id: 8,
      heuristic: 'Flexibility and efficiency of use',
      heuristicNumber: 'Heuristic #7',
      issue: 'No Keyboard Shortcuts or Search',
      description: 'Portal lacks global search and keyboard shortcuts, forcing users to navigate through multiple clicks.',
      impact: 'Medium',
      effort: 'Medium',
      evidence: 'pNPS score of -4 indicates significant usability friction',
      solution: 'Global search (Cmd+K) and keyboard navigation',
      demoRoute: '/dashboard',
      icon: 'search'
    }
  ];

  // Filter by impact
  highImpactIssues = this.issues.filter(i => i.impact === 'High');
  mediumImpactIssues = this.issues.filter(i => i.impact === 'Medium');

  // Quick wins (High Impact + Low Effort)
  quickWins = this.issues.filter(i => i.impact === 'High' && i.effort === 'Low');

  getImpactClass(impact: string): string {
    return {
      'High': 'impact-high',
      'Medium': 'impact-medium',
      'Low': 'impact-low'
    }[impact] || '';
  }

  getEffortClass(effort: string): string {
    return {
      'High': 'effort-high',
      'Medium': 'effort-medium',
      'Low': 'effort-low'
    }[effort] || '';
  }

  openExternalLink(url: string): void {
    window.open(url, '_blank');
  }
}
