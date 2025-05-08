// src/javascript/components/fight.js
import controls from '../../constants/controls';
import showWinnerModal from './modal/winner';

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function getHitPower(fighter) {
    return fighter.attack * getRandomNumber(1, 2);
}

function getBlockPower(fighter) {
    return fighter.defense * getRandomNumber(1, 2);
}

function getDamage(attacker, defender) {
    return Math.max(0, getHitPower(attacker) - getBlockPower(defender));
}

export default function fight(firstFighter, secondFighter) {
    return new Promise((resolve) => {
        const healthBars = {
            left: document.getElementById('left-fighter-indicator'),
            right: document.getElementById('right-fighter-indicator'),
        };

        const totalHealth = {
            [firstFighter.name]: firstFighter.health,
            [secondFighter.name]: secondFighter.health,
        };
        let currentHealth = { ...totalHealth };

        const pressedKeys = new Set();
        const criticalHits = {
            [firstFighter.name]: 0,
            [secondFighter.name]: 0,
        };
        const CRITICAL_COOLDOWN = 10000;

        const getHealthPercent = (name) =>
            (currentHealth[name] / totalHealth[name]) * 100;

        // eslint-disable-next-line no-param-reassign
        const updateHealth = (fighter, dmg, bar) => {
            currentHealth[fighter.name] = Math.max(
                0,
                currentHealth[fighter.name] - dmg,
            );
            // eslint-disable-next-line no-param-reassign
            bar.style.width = `${getHealthPercent(fighter.name)}%`;
        };

        const canUseCritical = (name) => {
            const now = Date.now();
            if (now - criticalHits[name] > CRITICAL_COOLDOWN) {
                criticalHits[name] = now;
                return true;
            }
            return false;
        };

        const finishFight = (winner) => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
            showWinnerModal(winner);
            resolve(winner);
        };

        const onKeyDown = (event) => {
            pressedKeys.add(event.code);

            const p1Block = pressedKeys.has(controls.PlayerOneBlock);
            const p2Block = pressedKeys.has(controls.PlayerTwoBlock);

            if (event.code === controls.PlayerOneAttack && !p1Block && !p2Block) {
                updateHealth(
                    secondFighter,
                    getDamage(firstFighter, secondFighter),
                    healthBars.right,
                );
            }

            if (event.code === controls.PlayerTwoAttack && !p2Block && !p1Block) {
                updateHealth(
                    firstFighter,
                    getDamage(secondFighter, firstFighter),
                    healthBars.left,
                );
            }

            if (
                controls.PlayerOneCriticalHitCombination.every((c) =>
                    pressedKeys.has(c),
                ) &&
                canUseCritical(firstFighter.name)
            ) {
                updateHealth(secondFighter, 2 * firstFighter.attack, healthBars.right);
            }

            if (
                controls.PlayerTwoCriticalHitCombination.every((c) =>
                    pressedKeys.has(c),
                ) &&
                canUseCritical(secondFighter.name)
            ) {
                updateHealth(firstFighter, 2 * secondFighter.attack, healthBars.left);
            }

            if (currentHealth[firstFighter.name] <= 0) {
                finishFight(secondFighter);
            } else if (currentHealth[secondFighter.name] <= 0) {
                finishFight(firstFighter);
            }
        };

        const onKeyUp = (event) => {
            pressedKeys.delete(event.code);
        };

        // eslint-disable-next-line no-use-before-define
        document.addEventListener('keydown', onKeyDown);
        // eslint-disable-next-line no-use-before-define
        document.addEventListener('keyup', onKeyUp);
    });
}
