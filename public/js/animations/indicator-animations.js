/**
    Helper functions that allow us to highlight elements within the page.
**/


async function addIndicator(elementId, delayInMilliseconds = 0) {
    await new Promise(resolve => setTimeout(resolve, delayInMilliseconds));
    
    const element = document.getElementById(elementId);
    if (!element.classList.contains("indicator-highlight-start")) {
        element.classList.add("indicator-highlight-start");
        await removeIndicator(element);
    }
}

async function removeIndicator(element) {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (element.classList.contains("indicator-highlight-start")) {
        element.classList.remove("indicator-highlight-start");
        element.classList.add("indicator-highlight-end");
    }

    await new Promise(resolve => setTimeout(resolve, 400));

    if (element.classList.contains("indicator-highlight-end")) {
        element.classList.remove("indicator-highlight-end");
    }
}

async function highlightTriggerRequestDropdownSection(delayInMilliseconds) {
    await addIndicator("trigger-request-dropdown", delayInMilliseconds);
}

async function highlightTerminalSection(delayInMilliseconds) {
    await addIndicator("terminal-section", delayInMilliseconds);
}

async function highlightCodeblockRequestSection(delayInMilliseconds) {
    await addIndicator("codeblock-request-section", delayInMilliseconds);
}

async function highlightCodeblockResponseSection(delayInMilliseconds) {
    await addIndicator("codeblock-response-section", delayInMilliseconds);
}

async function highlightAll() {
    await highlightTriggerRequestDropdownSection(1200);
    await highlightCodeblockRequestSection();
    await highlightTerminalSection();
    await highlightCodeblockResponseSection();
}

highlightAll();