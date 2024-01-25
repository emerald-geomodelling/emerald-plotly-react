export const updateSubplotTitles = (
  plot,
  instantiatedPlot,
  elements,
  context
) => {
  const titles = plot.traces.map((trace) => {
    let args = Object.values(trace)[0];
    let componentName = Object.keys(trace)[0];
    let subplotName = args.xaxis + args.yaxis;
    let title = null;
    if (
      elements.traces[componentName] &&
      elements.traces[componentName].title
    ) {
      try {
        title = elements.traces[componentName].title(context, args);
      } catch (e) {
        console.error(e);
      }
    }
    return [subplotName, title];
  });

  const updatedPlot = { ...instantiatedPlot };
  updatedPlot.layout = JSON.parse(JSON.stringify(updatedPlot.layout));

  for (let key in updatedPlot.layout) {
    if (key.startsWith("yaxis")) {
      let matchKey = key.replace("yaxis", "y");

      const matchedTitles = titles.filter(
        ([titleKey, titleValue]) =>
          titleKey.endsWith(matchKey) && titleValue !== undefined
      );

      matchedTitles.forEach((matchedTitle) => {
        if (matchedTitle && matchedTitle[1]) {
          /*console.log(
            `Matching ${key} with ${matchedTitle[0]} for title: ${matchedTitle[1]}`
          );*/
          if (!updatedPlot.layout[key]) {
            updatedPlot.layout[key] = {};
          }
          if (!updatedPlot.layout[key].title) {
            updatedPlot.layout[key].title = { text: "" };
          }
          updatedPlot.layout[key].title.text =
            updatedPlot.layout[key].title.text + " | " + matchedTitle[1];
        }
      });
    }
  }

  return updatedPlot;
};
