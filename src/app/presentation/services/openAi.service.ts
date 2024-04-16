import { Injectable } from '@angular/core';
import {
  audioToTextUseCase,
  imageGenerationUseCase,
  orthographyUseCase,
  proConsUseCase,
  prosConstStreamUseCase,
  textToAudioUseCase,
  translateUseCase,
} from '@use-cases/index';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OpenAiService {
  checkOrthography(prompt: string) {
    return from(orthographyUseCase(prompt));
  }

  compareProsCons(prompt: string) {
    return from(proConsUseCase(prompt));
  }

  compareProsConsStream(prompt: string, abortSignal: AbortSignal) {
    return prosConstStreamUseCase(prompt, abortSignal);
  }

  translateText(prompt: string, lang: string) {
    return from(translateUseCase(prompt, lang));
  }

  textToAudio(prompt: string, voice: string) {
    return from(textToAudioUseCase(prompt, voice));
  }

  AudioToText(file: File, prompt?: string) {
    return from(audioToTextUseCase(file, prompt));
  }

  imageGeneration(prompt: string, originalImage?: string, maskImage?: string) {
    return from(imageGenerationUseCase(prompt, originalImage, maskImage));
  }
}
