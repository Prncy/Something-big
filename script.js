document.addEventListener("DOMContentLoaded", () => {
    // Reveal Countdown Constants Configuration
    const targetRevealDate = new Date("2026-09-14T10:00:00").getTime();
    
    // Element Anchor Hooks
    const countdownContainer = document.getElementById("countdown");
    const theaterSection = document.getElementById("characterTheaterSection");
    const interactionInterface = document.getElementById("interactionInterface");
    const portalDeck = document.getElementById("portalDeck");
    
    const videoNode = document.getElementById("characterVideo");
    const viewportNode = document.getElementById("videoViewport");
    const captionNode = document.getElementById("captionOverlay");
    const finalWordsNode = document.getElementById("finalWordsOverlay");
    const actionDeckNode = document.getElementById("actionDeck");

    let captionTimerId = null;
    let sequenceActive = false;

    /* =========================================================================
       COUNTDOWN ENGINE WITH REVEAL LAYER
       ========================================================================= */
    function runCountdown() {
        const now = new Date().getTime();
        const difference = targetRevealDate - now;

        if (difference <= 0) {
            // 1. Hide Countdown layout
            countdownContainer.classList.add("hidden");
            // 2. Hide Character Question elements completely
            interactionInterface.classList.add("hidden");
            if (theaterSection) theaterSection.classList.add("hidden");
            // 3. Show prominent portal link action anchor
            portalDeck.classList.remove("hidden");
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Safety fallback checks to prevent null breaks if layout updates slightly
        if(document.getElementById("days")) document.getElementById("days").textContent = String(days).padStart(2, '0');
        if(document.getElementById("hours")) document.getElementById("hours").textContent = String(hours).padStart(2, '0');
        if(document.getElementById("minutes")) document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
        if(document.getElementById("seconds")) document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
    }
    setInterval(runCountdown, 1000);
    runCountdown();

    /* =========================================================================
       CINEMATIC INTERACTION INTERPOLATOR (UNLIMITED PASSES)
       ========================================================================= */
    function initializeInteractionDeck() {
        actionDeckNode.innerHTML = "";

        // Hydrate actionable interface triggers infinitely
        Object.keys(dialogueConfig).forEach(key => {
            const configuration = dialogueConfig[key];
            
            const actionBtn = document.createElement("button");
            actionBtn.className = "interaction-btn";
            actionBtn.textContent = configuration.buttonText;
            actionBtn.addEventListener("click", () => triggerInteraction(configuration));
            actionDeckNode.appendChild(actionBtn);
        });
    }

    function safetyTearDownPipelines() {
        if (captionTimerId) clearTimeout(captionTimerId);

        captionNode.classList.remove("visible");
        captionNode.textContent = "";
        finalWordsNode.classList.remove("visible");
        finalWordsNode.textContent = "";
        viewportNode.classList.remove("fade-out-dark");
        
        videoNode.onended = null;
    }

    function triggerInteraction(data) {
        if (sequenceActive) return;
        sequenceActive = true;

        // Lock interface buttons synchronously during animation runtime
        document.querySelectorAll(".interaction-btn").forEach(btn => btn.disabled = true);

        safetyTearDownPipelines();

        // Fix: Explicitly enforce browser muting rules directly on the node object before track mutation
        videoNode.muted = true;
        videoNode.src = data.videoSrc;
        videoNode.removeAttribute('loop'); // Ensure it triggers 'onended' cleanly instead of looping
        videoNode.load();

        // Play the video stream immediately in the user interaction click thread
        const videoPromise = videoNode.play();
        if (videoPromise !== undefined) {
            videoPromise.catch(err => {
                console.warn("Video viewport layout processing delayed: ", err);
                // Fail-safe: Unlock buttons immediately if the browser crashes on loading the video file
                sequenceActive = false;
                document.querySelectorAll(".interaction-btn").forEach(btn => btn.disabled = false);
            });
        }

        // Subtitle layer injection
        captionTimerId = setTimeout(() => {
            captionNode.textContent = data.captionText;
            captionNode.classList.add("visible");
        }, data.captionDelay);

        // Process final sequence matrices when the character video completes
        videoNode.onended = () => {
            captionNode.classList.remove("visible");
            viewportNode.classList.add("fade-out-dark");

            setTimeout(() => {
                finalWordsNode.textContent = data.finalWords;
                finalWordsNode.classList.add("visible");
            }, 400);

            // Return engine elements cleanly back to standard idle state loops
            setTimeout(() => {
                sequenceActive = false;
                safetyTearDownPipelines();
                
                videoNode.src = "media/idle.webm";
                videoNode.muted = true;
                videoNode.loop = true;
                videoNode.load();
                videoNode.play().catch(() => {});

                // Re-enable and reset interactive element state cleanly
                initializeInteractionDeck();
            }, 3500);
        };
    }

    // Launch Interactivity Engines
    initializeInteractionDeck();
});
