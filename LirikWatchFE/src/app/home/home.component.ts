import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {FilterService} from './services/filter.service';
import {FilterResult, Game, Video} from '../shared/models/filters';
import {VodMetadata} from '../shared/models/video';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  public searching = false;
  public searchString: string;
  public searchObservable: Subject<string> = new Subject<string>();

  public searchResults: Video[];
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
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.searchString = search;
      this.searching = !!this.searchString;
      this.loading = this.searching;

      // Do the actual search
      this.filterService.getTotalFilter(this.searchString)
        .subscribe(
          (filter) => {
            this.loading = false;
            this.filterResult = filter;
          },
          err => {
            // TODO PROPER ERROR
            console.error(err);
            this.loading = false;
          }
        );
    });

    this.filterService.getLatestVods(8)
      .subscribe((latest) => {
        this.latestVods = latest;
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
    this.router.navigate(['/vod', vodId.replace('v', '')]);
  }
}
