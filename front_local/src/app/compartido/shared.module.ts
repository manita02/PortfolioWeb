import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Base64ImageComponent } from './base64-image/base64-image.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { PeriodoInputComponent } from './periodo-input/periodo-input.component';
import { PeriodoDisplayComponent } from './periodo-display/periodo-display.component';
import { CatalogSelectComponent } from './catalog-select/catalog-select.component';
import { SkillChipsComponent } from './skill-chips/skill-chips.component';
import { SkillMultiSelectComponent } from './skill-multi-select/skill-multi-select.component';
import { OrgBadgeComponent } from './org-badge/org-badge.component';
import { OrgSelectComponent } from './org-select/org-select.component';
import { PdfLinkComponent } from './pdf-link/pdf-link.component';

const SHARED_COMPONENTS = [
  Base64ImageComponent,
  ImageUploadComponent,
  FileUploadComponent,
  PeriodoInputComponent,
  PeriodoDisplayComponent,
  CatalogSelectComponent,
  SkillChipsComponent,
  SkillMultiSelectComponent,
  OrgBadgeComponent,
  OrgSelectComponent,
  PdfLinkComponent
];

@NgModule({
  declarations: SHARED_COMPONENTS,
  imports: [CommonModule, FormsModule],
  exports: SHARED_COMPONENTS
})
export class SharedModule {}
