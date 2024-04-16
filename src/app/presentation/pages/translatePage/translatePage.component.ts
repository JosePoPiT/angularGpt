import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, TextMessageBoxFileComponent, TextMessageEvent, TextMessageSelectComponent, TextMessageBoxEvent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openAi.service';

@Component({
  selector: 'app-translate-page',
  standalone: true,
  imports: [
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    CommonModule,
    ReactiveFormsModule,
    TextMessageSelectComponent
  ],
  templateUrl: './translatePage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TranslatePageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService)

  public languages = signal([
    { id: 'alemán', text: 'Alemán' },
    { id: 'árabe', text: 'Árabe' },
    { id: 'bengalí', text: 'Bengalí' },
    { id: 'francés', text: 'Francés' },
    { id: 'hindi', text: 'Hindi' },
    { id: 'inglés', text: 'Inglés' },
    { id: 'japonés', text: 'Japonés' },
    { id: 'mandarín', text: 'Mandarín' },
    { id: 'portugués', text: 'Portugués' },
    { id: 'ruso', text: 'Ruso' },
  ]);

  handleSelectedFile({ prompt, selectedOption }: TextMessageBoxEvent) {
    const message = `Traduce a ${ selectedOption }: ${ prompt }`
    this.isLoading.set(true);
  
    this.messages.update((prev) => [
      ...prev,
      {
        isGpt: false,
        text: message,
      },
    ]);

    this.openAiService.translateText(prompt, selectedOption).subscribe((resp) => {
      console.log(resp);
      
      this.isLoading.set(false);
      this.messages.update((prev) => [
        ...prev,
        {
          isGpt: true,
          text: resp.message
        },
      ]);
    });
  }

  // handleMessageWithFile({ prompt, file }: TextMessageEvent) {
  //   console.log({ prompt, file });
  // }

  // handleMessageWithSelect(event: TextMessageBoxEvent) {
  //   console.log(event);
  // }

 }


