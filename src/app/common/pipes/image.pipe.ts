import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'getLargeImage',
    pure: true
  })

  export class GetLargeImagePipe implements PipeTransform {

    transform(pathToImage: string, args?: any): any {
        let img = pathToImage.replace('.tmb', '');
        img = img.replace('small_thumb.png', 'original.png');
        img = img.replace('small_thumb.jpg', 'original.jpg');
        img = img.replace('small_thumb.jpeg', 'original.jpeg');
        console.log('image.pipe.ts pathToImage:', pathToImage);
        console.log('image.pipe.ts img:', img);
        return img;
    }
  }
