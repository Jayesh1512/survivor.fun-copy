
const handleShare = async (isDead: boolean) => {
  // Check if Web Share API is supported
  if (!navigator.share) {
    alert('Sharing not supported on this browser');
    return;
  }

  try {
    // Choose image based on isDead
    const imagePath = isDead ? '/hero.png' : '/icon.png';
    
    const response = await fetch(imagePath);
    const blob = await response.blob();
    const file = new File([blob], 'game-result.png', { type: 'image/png' });

    // Check if we can share files
    if (navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: isDead ? 'Game Over!' : 'Victory!',
        text: isDead ? 'I died in the game!' : 'I won the game!',
        files: [file]
      });
    } else {
      // Fallback: share without image
      await navigator.share({
        title: isDead ? 'Game Over!' : 'Victory!',
        text: isDead ? 'I died in the game!' : 'I won the game!',
        url: window.location.href
      });
    }
  } catch (err) {
    console.log('Share cancelled or failed:', err);
  }
};

export { handleShare };