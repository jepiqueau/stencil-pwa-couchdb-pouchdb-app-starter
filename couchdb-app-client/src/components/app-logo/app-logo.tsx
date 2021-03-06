import { Component, Prop, Element } from '@stencil/core';

@Component({
  tag: 'app-logo',
  styleUrl: 'app-logo.scss'
})
export class AppLogo {

    @Element() el: HTMLElement;
    @Prop() width:string = '100%';

    // rendering
    render() {
        let style:any = {'width': this.width};
        return (
            <div class="card" style={style}>
                <div class='svg-container'>
                    <svg viewBox="0 0 512 512"
                        xmlns="http://www.w3.org/2000/svg" version="1.1">
                        <symbol id="sym01" viewbox="0 0 20 140">
                            <path d="M0 10 A 10 10, 0, 0, 1 20 10 L 20 130 A 10 10, 0, 0, 1 0 130 L 0 10" fill="none" stroke="#000000" stroke-width="2"/>           
                        </symbol>     
                        <rect x="0" y="0" width="512" height="512" fill="#ffffff"/>
                        <rect x="10" y="30" width="492" height="220" fill="#000000" transform="rotate(0,0, 0) translate(0,0) scale(1,1)"/>
                        <rect x="11" y="250" width="490" height="232" fill="none" stroke="#000000" stroke-width="2" transform="rotate(0,0, 0) translate(0,0) scale(1,1)"/>
                        <path d="M11 340 A 90 90, 0, 0, 1 101 250 L 400 250 A 90 90, 0, 0, 1 501 340" fill="none" stroke="#000000" stroke-width="2"/>
                        <circle cx="81" cy="320" r="30" fill="none" stroke="#000000" stroke-width="2"/>
                        <circle cx="431" cy="320" r="30" fill="none" stroke="#000000" stroke-width="2"/>
                        <use href="#sym01" x="146" y="300" width="20" height="140"/>
                        <use href="#sym01" x="186" y="300" width="20" height="140"/>
                        <use href="#sym01" x="226" y="300" width="20" height="140"/>
                        <use href="#sym01" x="266" y="300" width="20" height="140"/>
                        <use href="#sym01" x="306" y="300" width="20" height="140"/>
                        <use href="#sym01" x="346" y="300" width="20" height="140"/>
                    </svg>          
                </div>
            </div>
        );
    }
}