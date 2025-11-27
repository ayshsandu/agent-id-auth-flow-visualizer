export enum FlowType {
  DIRECT = 'DIRECT',
  AGENT = 'AGENT',
  OBO = 'OBO',
}

export interface DiagramNode {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'user' | 'client' | 'agent' | 'server';
}

export interface VideoGenerationState {
  isGenerating: boolean;
  progressMessage: string;
  videoUri: string | null;
  error: string | null;
}