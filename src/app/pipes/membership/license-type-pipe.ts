import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'membershipLicenseType',
})
export class LicenseTypePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    if (!value) {
      return '';
    }
    switch (value) {
      case 'hobby':
        return $localize`:@@membership.licenseType.hobby:Hobby`;
      case 'competition':
        return $localize`:@@membership.licenseType.competition:Competition`;
      default:
        return '';
    }
  }
}
