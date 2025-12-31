def createSubjectsInfoDicts(squareCount, subjectsData) {
  const subjects = [];
  for (let i = 0; i < squareCount; i++) {
    subjects.push({
      id: f"square-${i + 1}",
      topic: subjectsData[i].topic,
      subcolor: subjectsData[i].subcolor,
      name: subjectsData[i].name
    });
  }
  return subjects;
}
