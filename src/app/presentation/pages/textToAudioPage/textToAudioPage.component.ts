import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ChatMessageComponent,
  MyMessageComponent,
  TypingLoaderComponent,
  TextMessageBoxComponent,
  TextMessageBoxEvent,
  TextMessageSelectComponent,
} from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openAi.service';

@Component({
  selector: 'app-text-to-audio-page',
  standalone: true,
  imports: [
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    CommonModule,
    ReactiveFormsModule,
    TextMessageBoxComponent,
    TextMessageSelectComponent,
  ],
  templateUrl: './textToAudioPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TextToAudioPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  public voices = signal([
    { id: 'nova', text: 'Nova' },
    { id: 'alloy', text: 'Alloy' },
    { id: 'echo', text: 'Echo' },
    { id: 'fable', text: 'Fable' },
    { id: 'onyx', text: 'Onyx' },
    { id: 'shimmer', text: 'Shimmer' },
  ]);

  handleMessageWithSelect({ prompt, selectedOption }: TextMessageBoxEvent) {
    const message = `${selectedOption} - ${prompt}`;

    this.messages.update((prev) => [...prev, { text: message, isGpt: false }]);
    this.isLoading.set(true);
    this.openAiService
      .textToAudio(prompt, selectedOption)
      .subscribe(({ message, audioUrl }) => {
        this.isLoading.set(false);
        this.messages.update((prev) => [
          ...prev,
          {
            isGpt: true,
            text: message,
            audioUrl: audioUrl,
          },
        ]);
      });
  }
}
