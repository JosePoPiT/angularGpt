import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openAi.service';

@Component({
  selector: 'app-pros-cons-stream-page',
  standalone: true,
  imports: [
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    CommonModule,
    ReactiveFormsModule,
    TextMessageBoxComponent
  ],
  templateUrl: './prosConsStreamPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsStreamPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);
  public abortSignal = new AbortController();

  async handleMessage(text: string) {
    this.abortSignal.abort();
    this.abortSignal = new AbortController();
    this.messages.update( prev => [
      ...prev,
      {
        isGpt: false,
        text: text
      },
      {
        isGpt: true,
        text: '...'
      }
    ])

    this.isLoading.set(true);
    const stream = this.openAiService.compareProsConsStream(text, this.abortSignal.signal);
    this.isLoading.set(false);

    for await (const text of stream) {
      this.handleStreamResponse(text);
      
    }
      
  }

  handleStreamResponse( message: string) {
    this.messages().pop();
    const messages = this.messages();


    this.messages.set([ ...messages, { isGpt: true, text: message}])
  }

  // handleMessageWithFile({ prompt, file }: TextMessageEvent) {
  //   console.log({ prompt, file });
  // }

  // handleMessageWithSelect(event: TextMessageBoxEvent) {
  //   console.log(event);
  // }
}
