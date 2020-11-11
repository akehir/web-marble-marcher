import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShaderModule, ShaderService } from '@triangular/shader';

@NgModule({
  declarations: [
    AppComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ShaderModule.forRoot({
          RESIZE: true,
          SCREENSHOT_KEY_CODE: 'KeyS',
        }),
    ],
  providers: [ShaderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
