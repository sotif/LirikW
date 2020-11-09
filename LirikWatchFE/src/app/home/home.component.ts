import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {FilterService} from './services/filter.service';
import {FilterResult, Game} from '../shared/models/filters';
import {VodMetadata} from '../shared/models/video';
import {Router} from '@angular/router';
import {vodMetaToInternalVideo, vodMetaToInternalVodMetadataSortedGameList} from '../shared/models/vodFriends';
import {createGameList} from '../shared/models/searchFriends';

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

  public showSearchResults = false;

  public showLatestVodsMoreButton = false;
  public showLatestVodsMoreSpinner = false;
  private latestVodsCurrentOffset = 0;
  public showSearchResultsMoreButton = false;
  public showSearchResultsMoreSpinner = false;
  private searchResultsCurrentOffset = 0;

  private lastGameSearchId: string;
  private lastStringSearch: string;

  private dropDownElement: any;

  private earlySearchString: string;

  private destroy$ = new Subject();

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
  ) {
  }

  ngOnInit(): void {
    this.searchObservable.pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(search => {
      this.searchString = search;

      if (this.lastStringSearch && this.lastStringSearch === this.searchString) {
        this.searching = false;
        this.loading = false;
        return;
      }

      this.searching = !!this.searchString && this.searchString.length > 1;
      this.loading = this.searching;
      if (!this.searching) {
        return;
      }

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
        this.latestVods = latest.map(vodMetaToInternalVodMetadataSortedGameList);
        if (this.latestVods.length >= 10) {
          this.showLatestVodsMoreButton = true;
          this.latestVodsCurrentOffset = 10;
        }
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
        (this.filterResult.filterGames && this.filterResult.filterGames.length > 0) ||
        (this.filterResult.filterTitles && this.filterResult.filterTitles.length > 0) ||
        (this.filterResult.filterDates && this.filterResult.filterDates.length > 0)
      );
  }

  public searchChanged(e: string): void {
    this.earlySearchString = e;
    this.searchObservable.next(e);
  }

  public filterByGame(game: Game): void {
    this.lastGameSearchId = game.id;
    this.lastStringSearch = null;
    this.searching = false;
    this.loading = false;
    this.searchString = '';
    this.searchResults = null;

    this.showSearchResults = true;

    this.filterService.getFilterByGame(game.id, 'dsc', 10)
      .subscribe(vods => {
        this.searchResults = vods.map(vodMetaToInternalVodMetadataSortedGameList);
        if (this.searchResults.length >= 10) {
          this.showSearchResultsMoreButton = true;
          this.searchResultsCurrentOffset = 10;
        }
      }, err => {
        // TODO PROPER ERROR HANDLING
        console.error(err);
      });
  }

  public onVodClick(vodId: string): void {
    this.router.navigate(['/vod', vodId]);
  }

  public pressEnterOnSearchBox(): void {
    if (!this.earlySearchString || this.earlySearchString.length < 2) {
      return;
    }
    this.lastGameSearchId = null;
    this.lastStringSearch = this.earlySearchString;

    this.searching = false;
    this.loading = false;
    this.showSearchResults = true;

    this.searchResults = null;

    this.filterService.getTotalFilter(this.earlySearchString, 15, 'dsc')
      .subscribe(
        (filter) => {
          // We want the search results by title and date and merge them together into the search results
          // bcs its probably one of both ^^
          const byTitle = filter.byTitle.map(vodMetaToInternalVodMetadataSortedGameList);
          const byDate = filter.byDate.map(vodMetaToInternalVodMetadataSortedGameList);
          this.searchResults = byTitle.concat(byDate);
          if (this.searchResults.length >= 15) {
            this.showSearchResultsMoreButton = true;
            this.searchResultsCurrentOffset = 15;
          }
        },
        err => {
          // TODO PROPER ERROR
          console.error(err);
          this.loading = false;
        }
      );
  }

  public moreLatestVodsClick(): void {
    this.showLatestVodsMoreButton = false;
    this.showLatestVodsMoreSpinner = true;
    const lengthBefore = this.latestVods.length;
    this.filterService.getLatestVods(15, this.latestVodsCurrentOffset)
      .subscribe((latest) => {
        this.showLatestVodsMoreSpinner = false;
        if (!latest) {
          return;
        }
        this.latestVods = this.latestVods.concat(latest.map(vodMetaToInternalVodMetadataSortedGameList));

        if (this.latestVods.length >= lengthBefore + 15) {
          this.showLatestVodsMoreButton = true;
          this.latestVodsCurrentOffset = this.latestVods.length;
        }
      }, err => {
        // TODO proper ERROR
        this.showLatestVodsMoreSpinner = false;
        console.error(err);
      });
  }

  public moreSearchResultsClick(): void {
    const lengthBefore = this.searchResults.length;
    this.showSearchResultsMoreButton = false;
    this.showSearchResultsMoreSpinner = true;

    if (this.lastGameSearchId) {
      this.filterService.getFilterByGame(this.lastGameSearchId, 'dsc', 10, this.searchResultsCurrentOffset)
        .subscribe(vods => {
          this.showSearchResultsMoreSpinner = false;

          this.searchResults = this.searchResults.concat(vods.map(vodMetaToInternalVodMetadataSortedGameList));

          if (this.searchResults.length >= lengthBefore + 10) {
            this.showSearchResultsMoreButton = true;
            this.searchResultsCurrentOffset = this.searchResults.length;
          }
        }, err => {
          this.showSearchResultsMoreSpinner = false;
          // TODO PROPER ERROR HANDLING
          console.error(err);
        });
    }
    else if (this.lastStringSearch) {
      this.filterService.getTotalFilter(this.earlySearchString, 10, 'dsc', this.searchResultsCurrentOffset)
        .subscribe(
          (filter) => {
            this.showSearchResultsMoreSpinner = false;
            // We want the search results by title and date and merge them together into the search results
            // bcs its probably one of both ^^
            const byTitle = filter.byTitle.map(vodMetaToInternalVodMetadataSortedGameList);
            const byDate = filter.byDate.map(vodMetaToInternalVodMetadataSortedGameList);

            this.searchResults = this.searchResults.concat(byTitle.concat(byDate));

            if (this.searchResults.length >= lengthBefore + 10) {
              this.showSearchResultsMoreButton = true;
              this.searchResultsCurrentOffset = this.searchResults.length;
            }
          },
          err => {
            // TODO PROPER ERROR
            console.error(err);
            this.loading = false;
            this.showSearchResultsMoreSpinner = false;
          }
        );

    } else {
      return;
    }
  }
}
