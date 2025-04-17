import type { AccessibilityIssue } from '../types';

/**
 * Tests media elements for accessibility compliance
 * @param container The HTML container with the document content
 * @returns An array of accessibility issues related to media
 */
export async function testMediaAccessibility(container: HTMLElement): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];
  
  // Find all audio and video elements
  const audioElements = container.querySelectorAll('audio');
  const videoElements = container.querySelectorAll('video');
  const iframeElements = container.querySelectorAll('iframe'); // For embedded media
  
  // Check audio elements
  audioElements.forEach((audio, index) => {
    issues.push(...checkAudioElement(audio as HTMLAudioElement, index));
  });
  
  // Check video elements
  videoElements.forEach((video, index) => {
    issues.push(...checkVideoElement(video as HTMLVideoElement, index));
  });
  
  // Check iframe elements for embedded media players
  iframeElements.forEach((iframe, index) => {
    issues.push(...checkEmbeddedMedia(iframe as HTMLIFrameElement, index));
  });
  
  return issues;
}

/**
 * Checks an audio element for accessibility issues
 */
function checkAudioElement(audio: HTMLAudioElement, index: number): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const hasControls = audio.hasAttribute('controls');
  const hasSrc = audio.hasAttribute('src');
  const hasFallback = audio.children.length > 0;
  
  // Basic information about the audio element
  const mediaDetails = {
    source: audio.getAttribute('src') || '',
    playerType: 'HTML5 Audio',
    hasAccessibleControls: hasControls,
    keyboardAccessible: hasControls, // HTML5 controls are generally keyboard accessible
    hasTranscript: false, // Cannot determine automatically
    format: audio.getAttribute('type') || getFormatFromSrc(audio.getAttribute('src') || '')
  };
  
  // Check for missing controls
  if (!hasControls) {
    issues.push({
      id: 'audio-missing-controls',
      impact: 'serious',
      description: `Audio element #${index + 1} does not have controls, making it inaccessible to users who need them.`,
      nodes: [audio.outerHTML],
      wcagCriteria: ['2.1.1', '2.2.2'],
      mediaType: 'audio',
      mediaDetails,
      fixSuggestion: 'Add the "controls" attribute to the audio element to provide standard playback controls.'
    });
  }
  
  // Check for missing source
  if (!hasSrc && !hasFallback) {
    issues.push({
      id: 'audio-missing-source',
      impact: 'critical',
      description: `Audio element #${index + 1} has no source file or fallback content.`,
      nodes: [audio.outerHTML],
      wcagCriteria: ['1.1.1'],
      mediaType: 'audio',
      mediaDetails,
      fixSuggestion: 'Add a valid source to the audio element or provide fallback content for browsers that do not support HTML5 audio.'
    });
  }
  
  // Check for autoplay (which can be problematic for accessibility)
  if (audio.autoplay) {
    issues.push({
      id: 'audio-autoplay',
      impact: 'moderate',
      description: `Audio element #${index + 1} has autoplay enabled, which can be disruptive and may interfere with screen readers.`,
      nodes: [audio.outerHTML],
      wcagCriteria: ['1.4.2', '2.2.2'],
      mediaType: 'audio',
      mediaDetails: { ...mediaDetails, autoplay: true },
      fixSuggestion: 'Remove the "autoplay" attribute and allow users to start audio playback manually.'
    });
  }
  
  // Check for transcript (can only infer based on context)
  // This is a "warning" since we can't definitively determine if a transcript exists
  issues.push({
    id: 'audio-transcript-warning',
    impact: 'moderate',
    description: `Audio element #${index + 1} may need a transcript for users who cannot hear the audio content.`,
    nodes: [audio.outerHTML],
    wcagCriteria: ['1.2.1'],
    mediaType: 'audio',
    mediaDetails,
    fixSuggestion: 'Provide a text transcript for all audio content. The transcript should be linked near the audio element.'
  });
  
  return issues;
}

/**
 * Checks a video element for accessibility issues
 */
function checkVideoElement(video: HTMLVideoElement, index: number): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const hasControls = video.hasAttribute('controls');
  const hasSrc = video.hasAttribute('src');
  // Check for presence of track elements
  const hasCaptionTrack = Array.from(video.querySelectorAll('track')).some(
    track => track.kind === 'captions' || track.kind === 'subtitles'
  );
  const hasDescriptionTrack = Array.from(video.querySelectorAll('track')).some(
    track => track.kind === 'descriptions'
  );
  
  // Basic information about the video element
  const mediaDetails = {
    source: video.getAttribute('src') || '',
    playerType: 'HTML5 Video',
    hasAccessibleControls: hasControls,
    keyboardAccessible: hasControls,
    hasCaptions: hasCaptionTrack,
    hasAudioDescription: hasDescriptionTrack,
    format: video.getAttribute('type') || getFormatFromSrc(video.getAttribute('src') || ''),
    autoplay: video.autoplay
  };
  
  // Check for missing controls
  if (!hasControls) {
    issues.push({
      id: 'video-missing-controls',
      impact: 'serious',
      description: `Video element #${index + 1} does not have controls, making it inaccessible to users who need them.`,
      nodes: [video.outerHTML],
      wcagCriteria: ['2.1.1', '2.2.2'],
      mediaType: 'video',
      mediaDetails,
      fixSuggestion: 'Add the "controls" attribute to the video element to provide standard playback controls.'
    });
  }
  
  // Check for missing source
  if (!hasSrc && video.querySelectorAll('source').length === 0) {
    issues.push({
      id: 'video-missing-source',
      impact: 'critical',
      description: `Video element #${index + 1} has no source file.`,
      nodes: [video.outerHTML],
      wcagCriteria: ['1.1.1'],
      mediaType: 'video',
      mediaDetails,
      fixSuggestion: 'Add a valid source to the video element using either the src attribute or source elements.'
    });
  }
  
  // Check for captions
  if (!hasCaptionTrack) {
    issues.push({
      id: 'video-missing-captions',
      impact: 'critical',
      description: `Video element #${index + 1} does not have captions, making it inaccessible to deaf or hard-of-hearing users.`,
      nodes: [video.outerHTML],
      wcagCriteria: ['1.2.2'],
      mediaType: 'video',
      mediaDetails,
      fixSuggestion: 'Add a track element with kind="captions" or kind="subtitles" to provide synchronized text alternatives for the video content.'
    });
  }
  
  // Check for audio descriptions
  if (!hasDescriptionTrack) {
    issues.push({
      id: 'video-missing-descriptions',
      impact: 'serious',
      description: `Video element #${index + 1} does not have audio descriptions, which may be needed for users who are blind or have low vision.`,
      nodes: [video.outerHTML],
      wcagCriteria: ['1.2.3', '1.2.5'],
      mediaType: 'video',
      mediaDetails,
      fixSuggestion: 'Add a track element with kind="descriptions" to provide audio descriptions of important visual content in the video.'
    });
  }
  
  // Check for autoplay (which can be problematic for accessibility)
  if (video.autoplay) {
    issues.push({
      id: 'video-autoplay',
      impact: 'moderate',
      description: `Video element #${index + 1} has autoplay enabled, which can be disruptive.`,
      nodes: [video.outerHTML],
      wcagCriteria: ['1.4.2', '2.2.2'],
      mediaType: 'video',
      mediaDetails,
      fixSuggestion: 'Remove the "autoplay" attribute and allow users to start video playback manually.'
    });
  }
  
  return issues;
}

/**
 * Checks an iframe element for potentially embedded media
 */
function checkEmbeddedMedia(iframe: HTMLIFrameElement, index: number): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const src = iframe.getAttribute('src') || '';
  
  // Basic detection of common media embedding services
  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
  const isVimeo = src.includes('vimeo.com');
  const isSoundCloud = src.includes('soundcloud.com');
  const isSpotify = src.includes('spotify.com') || src.includes('spotify.com');
  
  if (isYouTube || isVimeo || isSoundCloud || isSpotify) {
    const mediaType = (isYouTube || isVimeo) ? 'video' : 'audio';
    const playerType = isYouTube ? 'YouTube' : 
                       isVimeo ? 'Vimeo' : 
                       isSoundCloud ? 'SoundCloud' : 'Spotify';
    
    // Check for title attribute on iframe (important for accessibility)
    if (!iframe.hasAttribute('title') || !iframe.getAttribute('title')?.trim()) {
      issues.push({
        id: 'embedded-media-missing-title',
        impact: 'serious',
        description: `Embedded ${playerType} ${mediaType} in iframe #${index + 1} is missing a descriptive title attribute.`,
        nodes: [iframe.outerHTML],
        wcagCriteria: ['2.4.1', '4.1.2'],
        mediaType: 'embedded',
        mediaDetails: {
          source: src,
          playerType,
          keyboardAccessible: false // Default to false since we can't verify
        },
        fixSuggestion: `Add a descriptive title attribute to the iframe element, e.g., title="${playerType} ${mediaType}: [Description of content]".`
      });
    }
    
    // Parameters for YouTube and Vimeo that may affect accessibility
    if (isYouTube) {
      // Check if captions are disabled
      if (src.includes('cc_load_policy=0')) {
        issues.push({
          id: 'youtube-captions-disabled',
          impact: 'critical',
          description: `YouTube video in iframe #${index + 1} has captions explicitly disabled (cc_load_policy=0).`,
          nodes: [iframe.outerHTML],
          wcagCriteria: ['1.2.2'],
          mediaType: 'embedded',
          mediaDetails: {
            source: src,
            playerType: 'YouTube',
            hasCaptions: false
          },
          fixSuggestion: 'Remove cc_load_policy=0 from the YouTube embed URL, or set it to 1 to force captions on by default.'
        });
      }

      // Check if YouTube keyboard controls are disabled
      if (src.includes('disablekb=1')) {
        issues.push({
          id: 'youtube-keyboard-disabled',
          impact: 'critical',
          description: `YouTube video in iframe #${index + 1} has keyboard controls disabled (disablekb=1).`,
          nodes: [iframe.outerHTML],
          wcagCriteria: ['2.1.1'],
          mediaType: 'embedded',
          mediaDetails: {
            source: src,
            playerType: 'YouTube',
            keyboardAccessible: false
          },
          fixSuggestion: 'Remove disablekb=1 from the YouTube embed URL to enable keyboard controls.'
        });
      }
    }
    
    // General warning about checking captions and transcripts for embedded media
    issues.push({
      id: `${mediaType}-embedded-accessibility-warning`,
      impact: 'moderate',
      description: `Embedded ${playerType} ${mediaType} in iframe #${index + 1} should be checked manually to ensure it has proper captions${mediaType === 'video' ? ', audio descriptions,' : ''} and transcripts.`,
      nodes: [iframe.outerHTML],
      wcagCriteria: ['1.2.1', '1.2.2', '1.2.3'],
      mediaType: 'embedded',
      mediaDetails: {
        source: src,
        playerType
      },
      fixSuggestion: `Ensure the ${playerType} ${mediaType} has closed captions${mediaType === 'video' ? ' and audio descriptions' : ''} enabled. Also provide a link to a text transcript near the embedded media.`
    });
  }
  
  return issues;
}

/**
 * Helper function to extract format from file extension
 */
function getFormatFromSrc(src: string): string {
  const matches = src.match(/\.([a-z0-9]+)(?:$|\?)/i);
  if (matches && matches[1]) {
    return matches[1].toLowerCase();
  }
  return '';
}