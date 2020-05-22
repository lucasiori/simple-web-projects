const states = [
  { description: 'stop', active: false },
  { description: 'warning', active: false },
  { description: 'continue', active: false }
]

setInterval(function() {
  const index = states.findIndex((item) => !!item.active);

  if (index < 0) {
    states[0].active = true;
    document.querySelector('.traffic-light').classList.add('stop');
    document.querySelector('.traffic-description').classList.add('stop');
  } else {
    const newIndex = index === 2 ? 0 : index + 1;

    states[index].active = false;
    states[newIndex].active = true;

    document.querySelector('.traffic-light').classList.remove(states[index].description);
    document.querySelector('.traffic-description').classList.remove(states[index].description);

    document.querySelector('.traffic-light').classList.add(states[newIndex].description);
    document.querySelector('.traffic-description').classList.add(states[newIndex].description);
  }
}, 5000);