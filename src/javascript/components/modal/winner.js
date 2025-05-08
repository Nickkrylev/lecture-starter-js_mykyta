import showModal from './modal';
import { createFighterImage } from '../fighterPreview';

export default function showWinnerModal(fighter) {
    const { name } = fighter;

    const title = `${name} wins!`;
    const bodyElement = createFighterImage(fighter);

    showModal({
        title,
        bodyElement
    });
}
