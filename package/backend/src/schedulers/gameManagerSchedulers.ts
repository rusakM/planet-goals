import cron from 'node-cron';
import { gameManagerService } from '../services';

export default function setupSchedulers() {
    cron.schedule('* * * * *', () => {
        console.log('Game manager info:\n', gameManagerService.gameManager.getCurrentPlayedGamesIds());
    });
}
