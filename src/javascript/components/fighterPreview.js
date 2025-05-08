import createElement from '../helpers/domHelper';

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    if (fighter) {
        const image = createFighterImage(fighter);
        const name = createElement({ tagName: 'p', className: 'fighter-preview___name' });
        name.innerText = `Name: ${fighter.name}`;

        const health = createElement({ tagName: 'p', className: 'fighter-preview___info' });
        health.innerText = `Health: ${fighter.health}`;

        const attack = createElement({ tagName: 'p', className: 'fighter-preview___info' });
        attack.innerText = `Attack: ${fighter.attack}`;

        const defense = createElement({ tagName: 'p', className: 'fighter-preview___info' });
        defense.innerText = `Defense: ${fighter.defense}`;

        fighterElement.append(image, name, health, attack, defense);
    }

    return fighterElement;
}
