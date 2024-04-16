import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, TextMessageEvent, TextMessageBoxFileComponent } from '@components/index';
import { AudioToTextInterface } from '@interfaces/audio-text.response';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openAi.service';

@Component({
  selector: 'app-audio-text-page',
  standalone: true,
  imports: [
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    CommonModule,
    ReactiveFormsModule,
    TextMessageBoxComponent,
    TextMessageBoxFileComponent
  ],
  templateUrl: './audioTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AudioTextPageComponent {

  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  
  handleMessageWithFile({ prompt, file }: TextMessageEvent) {
    const text = file.name ?? prompt ?? 'Traduce el audio';

    this.isLoading.set(true);
    this.messages.update( prev => [
      ...prev, {
        isGpt: false,
        text: text
      }
    ])

    this.openAiService.AudioToText( file, text )
      .subscribe(resp => this.handleResponse(resp))
  }

  handleResponse(resp: AudioToTextInterface | null) {
    this.isLoading.set(false);

    if (!resp) {
      return;

    }
  const text = `## Transcripcion:
__Duración:__${ Math.round( resp.duration ) }segundos.
  

## El texto es:
${ resp.text }
  `;

  this.messages.update( prev => [...prev, { isGpt: true, text: text}]);

  for( const segment of resp.segments) {
    const segmentMessage = `
__De ${ Math.round(segment.start)} a ${ Math.round( segment.end)} segundos.__
${segment.text}   
    `;

    this.messages.update( prev => [...prev, { isGpt: true, text: segmentMessage}]);
  
  }

  }
 }
