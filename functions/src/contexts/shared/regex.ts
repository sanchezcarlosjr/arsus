const Jimp = require('jimp');

export function getGroups(str: string, regex: RegExp): string[] {
  let res = str.match(regex);
  const groups: string[] = [];
  for (const match of res) {
    res = match.match(regex);
    groups.push(RegExp.$1);
  }
  return groups;
}

export async function getImages(str: string): Promise<string> {
  const images = str.match(/"https:([\/|.|\w|\s|-])*\.(png|gif|jpg).*?"/g);
  if (!images) {
    return '';
  }
  const promises = images.map(async (image) => {
    image = image.replace(/"/g, '');
    try {
      const img = await Jimp.read(image);
      if (img.bitmap.width >= 200 && img.bitmap.height >= 200 && img.bitmap.width / img.bitmap.height > 1) {
        return image;
      }
    } catch (e) {
      console.warn(e.message);
      return '';
    }
    return '';
  });
  const safeImages = await Promise.all(promises);
  return safeImages.filter((temp) => !!temp)[0] || '';
}
