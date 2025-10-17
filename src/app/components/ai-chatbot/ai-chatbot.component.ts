import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
}

@Component({
  selector: 'app-ai-chatbot',
  templateUrl: './ai-chatbot.component.html',
  styleUrls: ['./ai-chatbot.component.scss']
})
export class AiChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  isOpen = false;
  isMinimized = false;
  messages: ChatMessage[] = [];
  userInput = '';
  isTyping = false;
  private shouldScrollToBottom = false;

  // Predefined responses for common ISC Portal questions
  private responses = {
    greeting: [
      "Hello! I'm your ISC Portal assistant. How can I help you today?",
      "Hi there! I can help you with sites, circuits, tickets, and more. What do you need?",
      "Welcome! I'm here to assist with your network management questions."
    ],
    sites: [
      "I can help you with site management. You can view all your sites on the Sites page, filter by type (SD-WAN), health status, or use the sources hierarchy to select specific locations.",
      "To manage sites: Go to Network Services → Sites. You can filter by site type, health status, or search for specific locations. Need help with a specific site?"
    ],
    circuits: [
      "For circuit information, visit Network Services → Circuits. You can view circuit health, bandwidth usage, and filter by status. What would you like to know about your circuits?",
      "Circuits can be managed from the Circuits page. You can see real-time status, packet loss metrics, and export data. Looking for a specific circuit?"
    ],
    tickets: [
      "To manage support tickets, go to Tickets & Events → Tickets. You can create new tickets, track existing ones, and view ticket history. Need help with ticketing?",
      "I can guide you through the ticketing system. You can create tickets, check status, and communicate with our support team. What do you need?"
    ],
    help: [
      "I can assist with:\n• Sites and locations\n• Circuit management\n• Network health monitoring\n• Creating support tickets\n• Navigating the portal\n• Reporting issues\n\nWhat would you like help with?",
      "Here's what I can help with:\n✓ Finding and managing sites\n✓ Monitoring circuit health\n✓ Creating and tracking tickets\n✓ Viewing network analytics\n✓ Generating reports\n\nJust ask!"
    ],
    navigation: [
      "To navigate: Use the left sidebar to access different sections. Key areas include Dashboard, Sites, Clouds, Circuits, and Tickets. Need help finding something specific?",
      "The main navigation is on the left. You can also use Cmd+K (Mac) or Ctrl+K (Windows) to open the command palette for quick navigation."
    ],
    default: [
      "I'm not sure I understand. Could you rephrase that? I can help with sites, circuits, tickets, and portal navigation.",
      "I didn't quite catch that. Try asking about sites, circuits, network health, or creating tickets.",
      "Could you provide more details? I'm here to help with your ISC Portal questions about sites, circuits, and support."
    ]
  };

  ngOnInit(): void {
    // Add welcome message
    this.addBotMessage(this.getRandomResponse('greeting'), false);
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.isMinimized = false;
    }
  }

  closeChat(): void {
    this.isOpen = false;
  }

  minimizeChat(): void {
    this.isMinimized = !this.isMinimized;
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    const userMessage: ChatMessage = {
      id: this.generateId(),
      text: this.userInput,
      sender: 'user',
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.shouldScrollToBottom = true;

    const query = this.userInput.toLowerCase();
    this.userInput = '';

    // Simulate typing delay
    this.isTyping = true;

    setTimeout(() => {
      this.isTyping = false;
      const response = this.generateResponse(query);
      this.addBotMessage(response);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  }

  private addBotMessage(text: string, scroll = true): void {
    const botMessage: ChatMessage = {
      id: this.generateId(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    this.messages.push(botMessage);
    if (scroll) {
      this.shouldScrollToBottom = true;
    }
  }

  private generateResponse(query: string): string {
    // Check for greetings
    if (this.matchesPattern(query, ['hi', 'hello', 'hey', 'greetings'])) {
      return this.getRandomResponse('greeting');
    }

    // Check for help requests
    if (this.matchesPattern(query, ['help', 'what can you do', 'features', 'capabilities'])) {
      return this.getRandomResponse('help');
    }

    // Check for sites
    if (this.matchesPattern(query, ['site', 'location', 'address', 'sd-wan'])) {
      return this.getRandomResponse('sites');
    }

    // Check for circuits
    if (this.matchesPattern(query, ['circuit', 'bandwidth', 'connection', 'network'])) {
      return this.getRandomResponse('circuits');
    }

    // Check for tickets
    if (this.matchesPattern(query, ['ticket', 'support', 'issue', 'problem', 'help desk'])) {
      return this.getRandomResponse('tickets');
    }

    // Check for navigation
    if (this.matchesPattern(query, ['navigate', 'find', 'where is', 'how do i get to'])) {
      return this.getRandomResponse('navigation');
    }

    // Default response
    return this.getRandomResponse('default');
  }

  private matchesPattern(query: string, keywords: string[]): boolean {
    return keywords.some(keyword => query.includes(keyword));
  }

  private getRandomResponse(category: keyof typeof this.responses): string {
    const responses = this.responses[category];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private scrollToBottom(): void {
    try {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}
