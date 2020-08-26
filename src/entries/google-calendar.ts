const importCalendarListener = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (
    target &&
    target.tagName === "BUTTON" &&
    target.innerText.toUpperCase() === "IMPORT GOOGLE CALENDAR"
  ) {
    const blocks = Array.from(document.getElementsByClassName("roam-block"));
    const calendarBlock = blocks.find((b) => {
      const blockSpan = b.children[0];
      if (!blockSpan) {
        return false;
      }
      return (
        blockSpan.childNodes.length === 2 &&
        blockSpan.children[0].tagName === "STRONG" &&
        blockSpan.children[0].innerHTML.toUpperCase() === "GOOGLE CALENDAR:"
      );
    });
    const calendarId = calendarBlock.children[0].childNodes[1].nodeValue;
    if (!calendarId) {
      console.warn("Could not find calendar ID!");
      return;
    }
    const apiBlock = blocks.find((b) => {
      const blockSpan = b.children[0];
      if (!blockSpan) {
        return false;
      }
      return (
        blockSpan.childNodes.length === 2 &&
        blockSpan.children[0].tagName === "STRONG" &&
        blockSpan.children[0].innerHTML.toUpperCase() === "API KEY:"
      );
    });
    const apiKey = apiBlock.children[0].childNodes[1].nodeValue;
    if (!apiKey) {
      console.warn("Could not find API KEY!");
      return;
    }
    const timeMin = new Date();
    const timeMax = new Date();
    const offset = timeMin.getTimezoneOffset() / 60;
    timeMin.setHours(-offset, 0, 0, 0);
    timeMax.setHours(-offset, 0, 0, 0);
    timeMax.setDate(timeMax.getDate() + 1);
    const offsetString =
      offset === 0 ? "Z" : `-${offset < 10 ? `0${offset}` : offset}:00`;
    const timeMinParam = `${timeMin
      .toISOString()
      .substring(0, timeMin.toISOString().length - 1)}${offsetString}`;
    const timeMaxParam = `${timeMax
      .toISOString()
      .substring(0, timeMin.toISOString().length - 1)}${offsetString}`;

    console.log("trigger import events");
    fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        calendarId
      )}/events?key=${apiKey}&timeMin=${timeMinParam}&timeMax=${timeMaxParam}`
    )
      .then((r) => r.json())
      .then((es) => {
        console.log(es);
        return 0;
      });
  }
};

document.addEventListener("click", importCalendarListener);