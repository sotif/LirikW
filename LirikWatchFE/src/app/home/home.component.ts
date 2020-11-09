import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {FilterService} from './services/filter.service';
import {FilterResult, Game} from '../shared/models/filters';
import {VodMetadata} from '../shared/models/video';
import {Router} from '@angular/router';
import {vodMetaToInternal, vodMetaToInternalVideo} from '../shared/models/vodFriends';
import {createGameList, SearchResults} from '../shared/models/searchFriends';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  public searching = false;
  public searchString: string;
  public searchObservable: Subject<string> = new Subject<string>();

  public searchResults: VodMetadata[];
  public filterResult: FilterResult;
  public loading = false;

  public latestVods: VodMetadata[];

  private dropDownElement: any;

  private destroy$  = new Subject();

  @ViewChild('searchDropdown', {static: false}) searchDropdown: ElementRef;

  @HostListener('document:click', ['$event']) onClick(e: any): void {
    if (!this.dropDownElement.contains(e.target)) {
      this.searching = false;
      this.loading = false;
    }
  }

  @HostListener('document:keydown', ['$event']) onKeyDown(e: KeyboardEvent): void {
    if (e.code === 'Escape') {
      this.searching = false;
      this.loading = false;
    }
  }

  constructor(
    private filterService: FilterService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.searchObservable.pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(search => {
      this.searchString = search;
      this.searching = !!this.searchString && this.searchString.length > 1;
      this.loading = this.searching;

      // Do the actual search
      this.filterService.getTotalFilter(this.searchString, 25, 'dsc')
        .subscribe(
          (filter) => {
            this.loading = false;
            this.filterResult = {
              filterGames: createGameList(this.searchString, filter.byGame),
              filterDates: filter.byDate.map(vodMetaToInternalVideo),
              filterTitles: filter.byTitle.map(vodMetaToInternalVideo)
            };
          },
          err => {
            // TODO PROPER ERROR
            console.error(err);
            this.loading = false;
          }
        );
    });

    this.filterService.getLatestVods(10)
      .subscribe((latest) => {
        if (!latest) {
          return;
        }
        this.latestVods = latest.map((v) => {
          v.games = v.games.map(g => {
            if (!g.positionMilliseconds) {
              g.positionMilliseconds = 0;
            }
            return g;
          }).sort((a, b) => {
            return a.positionMilliseconds < b.positionMilliseconds ? -1 : 1;
          });

          return vodMetaToInternal(v);
        });
      }, err => {
        // TODO proper ERROR
        console.error(err);
      });
  }

  ngAfterViewInit(): void {
    this.dropDownElement = this.searchDropdown.nativeElement;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  public hasAnyResult(): boolean {
    return this.filterResult &&
      (
        (this.filterResult.filterGames && this.filterResult.filterGames.length > 0 ) ||
        (this.filterResult.filterTitles && this.filterResult.filterTitles.length > 0) ||
        (this.filterResult.filterDates && this.filterResult.filterDates.length > 0)
      );
  }

  public searchChanged(e: string): void {
    this.searchObservable.next(e);
  }

  public filterByGame(game: Game): void {
    this.searching = false;
    this.loading = false;
    this.searchString = '';

    this.filterService.getFilterByGame(game.id)
      .subscribe(vods => {
        this.searchResults = vods;
      }, err => {
        // TODO PROPER ERROR HANDLING
        console.error(err);
      });
  }

  public onVodClick(vodId: string): void {
    this.router.navigate(['/vod', vodId]);
  }
}
