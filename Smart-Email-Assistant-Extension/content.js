console.log("Email Writer.....")

function injectButton(){
    const selector = ['.aDh, .btC, [role="dialog"]','.gU.Up' ];
    for(const selector of selector){
        const toolbar = document.querySelector(selector);
        if(toolbar){
            return toolbar;
        }
        return null;
    }
}

function createAIButton(){
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-at1 L3';
    button.style.marginRight = '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role','button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
}

const observer = new MutationObserver((mutations)=>{
    for(const mutation of mutations){
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="dialog"]')
            || node.querySelector('.aDh, .btC, [role = "dialog"]')
        )
        );

        if(hasComposeElements){
            console.log("Compose Window Detected.")
            setTimeout(injectButton, 500)
        }
    }
});

observer.observe(document.body, {
    childList: true, 
    subtree: true
})