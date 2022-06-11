import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuildSearcherPage } from './build-searcher.page';

describe('BuildSearcherPage', () => {
    let component: BuildSearcherPage;
    let fixture: ComponentFixture<BuildSearcherPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BuildSearcherPage],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(BuildSearcherPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
