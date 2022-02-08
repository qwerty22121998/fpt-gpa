window.onload = () => {
    if (location.href === "https://fap.fpt.edu.vn/Feedback/StudentFeedBack.aspx") {
        const feedbackTitle = document.querySelector("#aspnetForm > table > tbody > tr:nth-child(1) > td > div > h2");

        if (!feedbackTitle) return;

        feedbackTitle.innerHTML += ` - <button type="button" id="auto-feedback-btn">AUTO FEEDBACK</button>`;

        document.getElementById("auto-feedback-btn").addEventListener("click", () => {
            const openFeedbackLinks = document.querySelectorAll("#aspnetForm > table > tbody > tr:nth-child(1) > td > div > table a[href*='DoFeedback.aspx']");

            if (!openFeedbackLinks || openFeedbackLinks.length <= 0) return;

            let feedbackLinks = [];
            for (const openLink of openFeedbackLinks.values()) {
                feedbackLinks.push(openLink.href);
            }

            chrome.storage?.sync.set({ feedbackLinks: feedbackLinks });

            location.href = feedbackLinks[0];
        });
    }
    else {
        chrome.storage.sync.get(["feedbackLinks"], async (result) => {
            if (!result.feedbackLinks) return;

            let feedbackLinks = result.feedbackLinks;

            if (feedbackLinks.indexOf(location.href) >= 0) {
                document.getElementById("ctl00_mainContent_reload_ctl00_chkList_0")?.click();
                document.getElementById("ctl00_mainContent_reload_ctl01_chkList_0")?.click();
                document.getElementById("ctl00_mainContent_reload_ctl02_chkList_0")?.click();
                document.getElementById("ctl00_mainContent_reload_ctl03_chkList_0")?.click();
                document.getElementById("ctl00_mainContent_reload_ctl04_chkList_0")?.click();

                await new Promise((resolve) => setTimeout(resolve, 500));

                feedbackLinks = feedbackLinks.filter((link) => link !== location.href);

                await chrome.storage?.sync.set({ feedbackLinks: feedbackLinks });

                document.getElementById("ctl00_mainContent_btSendFeedback")?.click();
            } else if (feedbackLinks.length > 0) {
                location.href = feedbackLinks[0];
            } else {
                await chrome.storage?.sync.clear();
                location.href = "/";
            }
        });
    }
}