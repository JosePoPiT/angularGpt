import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, GptMessageEditableImageComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openAi.service';

@Component({
  selector: 'app-image-tunning-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    ReactiveFormsModule,
    TextMessageBoxComponent,
    GptMessageEditableImageComponent
  ],
  templateUrl: './imageTunningPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageTunningPageComponent {

  public messages = signal<Message[]>([
    {
      isGpt: true,
      text: 'Dummy image',
      imageInfo: {
        alt: 'gothic girl',
        url: 'http://localhost:3000/gpt/image-generation/1713044084966.png'
      }
    }
  ]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  public originalImage = signal<string | undefined>(undefined);

  handleMessage(text: string) {
    this.isLoading.set(true);
    this.messages.update((prev) => [...prev, { isGpt: false, text: text }]);

    this.openAiService.imageGeneration(text).subscribe((resp) => {
      this.isLoading.set(false);
      if (!resp) return;

      this.messages.update((prev) => [
        ...prev,
        {
          isGpt: true,
          text: resp.alt,
          imageInfo: resp
        },
      ]);
    });
  }

  handleImageChange( newImage: string, originalImage: string) {
  this.originalImage.set( originalImage )

  // Todo: Mask

  console.log({newImage, originalImage});
  
  }

  generateVariation() {

  }
 }
