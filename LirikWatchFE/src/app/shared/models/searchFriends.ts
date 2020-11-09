import {VodMeta} from './vodFriends';
import {Game} from './filters';

export interface SearchResults {
  byTitle: VodMeta[];
  byDate: VodMeta[];
  byGame: VodMeta[];
}

const createGameList = (search: string, gameResults: VodMeta[]) => {
  const combined: Game[] = [];
  const gameMap = new Map<string, null>();

  if (!gameResults) {
    return null;
  }

  gameResults.forEach(v => {
    if (!v.games) {
      return;
    }
    v.games.forEach(g => {
      if (!g.game.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
          gameMap.has(g.game.name)) {
        return;
      }
      // Otherwise add to combined list
      gameMap.set(g.game.name, null);
      combined.push({
        title: g.game.name,
        boxArtUrl: g.game.boxArtUrl,
        id: g.game.guid
      });
    });
  });

  return combined;
};

export {createGameList};
