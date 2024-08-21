const stickerCount = 32;

export const stickerPack = Array.from({ length: stickerCount }, (_, index) => ({
  id: index + 1,
  url: `/stickers/${(index + 1).toString().padStart(3, "0")}.png`,
  alt: `Sticker ${index + 1}`,
}));
