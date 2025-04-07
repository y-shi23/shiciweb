export interface Theme {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    button: string
    card: string
    block: string
  }
}

export const themes: Theme[] = [
  {
    name: '白天',
    colors: {
      primary: '#3B82F6',
      secondary: '#60A5FA',
      accent: '#93C5FD',
      background: '#FFFFFF',
      text: '#1F2937',
      button: '#3B82F6',
      card: '#FFFFFF',
      block: '#F3F4F6'
    }
  },
  {
    name: '黑夜',
    colors: {
      primary: '#60A5FA',
      secondary: '#3B82F6',
      accent: '#2563EB',
      background: '#a4b0be',
      text: '#ffffff',
      button: '#60A5FA',
      card: '#374151',
      block: '#4B5563'
    }
  },
  {
    name: '小满',
    colors: {
      primary: '#B81A35',
      secondary: '#C25160',
      accent: '#DD6B7B',
      background: '#E2A2AC',
      text: '#1F2937',
      button: '#DD6B7B',
      card: '#C25160',
      block: '#B81A35'
    }
  },
  {
    name: '东风解冻',
    colors: {
      primary: '#80A492',
      secondary: '#99BCAC',
      accent: '#B1D5C8',
      background: '#D5EBE1',
      text: '#1F2937',
      button: '#99BCAC',
      card: '#B1D5C8',
      block: '#80A492'
    }
  }
] 