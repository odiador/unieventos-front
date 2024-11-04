const getImageFromString = async (img: string) => {
    const response = await fetch(img);
    const blob = await response.blob();
    return new File([blob], `uploadedImage.${blob.type.split('/')[1]}`, { type: blob.type });
}
export { getImageFromString };