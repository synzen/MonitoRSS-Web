import React from 'react'
import styled from 'styled-components'
import pages from '../../constants/pages'
const Wrapper = styled.div`
  margin: 3em auto;
  max-width: 1450px;
  width: 100%;
`

function TermsAndConditions () {
  return (
    <Wrapper>
      <h2><strong>Terms and Conditions</strong></h2>

      <p>Welcome to Discord.RSS!</p>

      <p>These terms and conditions outline the rules and regulations for the use of Discord.RSS's Website, located at https://discordrss.xyz.</p>

      <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Discord.RSS if you do not agree to take all of the terms and conditions stated on this page.</p>

      <p>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.</p>

      <h3><strong>Cookies</strong></h3>

      <p>We employ the use of cookies. By accessing Discord.RSS, you agreed to use cookies in agreement with the Discord.RSS's Privacy Policy.</p>

      <p>Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.</p>

      <h3><strong>User Generated Contributions</strong></h3>

      {/* <p>Unless otherwise stated, Discord.RSS and/or its licensors own the intellectual property rights for all material on Discord.RSS. All intellectual property rights are reserved. You may access this from Discord.RSS for your own personal use subjected to restrictions set in these terms and conditions.</p>

      <p>You must not:</p>
      <ul>
        <li>Republish material from Discord.RSS</li>
        <li>Sell, rent or sub-license material from Discord.RSS</li>
        <li>Reproduce, duplicate or copy material from Discord.RSS</li>
        <li>Redistribute content from Discord.RSS</li>
      </ul>

      <p>This Agreement shall begin on the date hereof.</p> */}

      <p>The Website does not offer users to submit or post content. We may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Website, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions"). Contributions may be viewable by other users of the Website and through third-party websites. As such, any Contributions you transmit may be treated in accordance with the Website Privacy Policy. When you create or make available any Contributions, you thereby represent and warrant that:</p>
      <ol>
        <li>The creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party.</li>
        <li>You are the creator and owner of or have the necessary licenses, rights, consents, releases, and permissions to use and to authorize us, the Website, and other users of the Website to use your Contributions in any manner contemplated by the Website and these Terms of Use.</li>
        <li>You have the written consent, release, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness of each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the Website and these Terms of Use.</li>
        <li>Your Contributions are not false, inaccurate, or misleading.</li>
        <li>Your Contributions are not unsolicited or unauthorized advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation.</li>
        <li>Your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libelous, slanderous, or otherwise objectionable (as determined by us).</li>
        <li>Your Contributions do not ridicule, mock, disparage, intimidate, or abuse anyone.</li>
        <li>Your Contributions do not advocate the violent overthrow of any government or incite, encourage, or threaten physical harm against another.</li>
        <li>Your Contributions do not violate any applicable law, regulation, or rule.</li>
        <li>Your Contributions do not violate the privacy or publicity rights of any third party.</li>
        <li>Your Contributions do not contain any material that solicits personal information from anyone under the age of 18 or exploits people under the age of 18 in a sexual or violent manner.</li>
        <li>Your Contributions do not violate any applicable law concerning child pornography, or otherwise intended to protect the health or well-being of minors;</li>
        <li>Your Contributions do not include any offensive comments that are connected to race, national origin, gender, sexual preference, or physical handicap.</li>
        <li>Your Contributions do not otherwise violate, or link to material that violates, any provision of these Terms of Use, or any applicable law or regulation.</li>
      </ol>
      <p>Any use of the Website in violation of the foregoing violates these Terms of Use and may result in, among other things, termination or suspension of your rights to use the Website.</p>
      <h3><strong>Contribution License</strong></h3>
      <p>You and the Website agree that we may access, store, process, and use any information and personal data that you provide following the terms of the Privacy Policy and your choices (including settings).</p>
      <p>By submitting suggestions or other feedback regarding the Website, you agree that we can use and share such feedback for any purpose without compensation to you.</p>
      <p>We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable for any statements or representations in your Contributions provided by you in any area on the Website. You are solely responsible for your Contributions to the Website and you expressly agree to exonerate us from any and all responsibility and to refrain from any legal action against us regarding your Contributions.</p>

      <h3><strong>Reservation of Rights</strong></h3>

      <p>We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it’s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.</p>

      <h3><strong>Content Liability</strong></h3>

      <p>We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.</p>

      <h3><strong>Your Privacy</strong></h3>

      <p>Please read our <a href={pages.PRIVACY_POLICY}>Privacy Policy</a>.</p>

      <h3><strong>Removal of links from our website</strong></h3>

      <p>If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.</p>

      <p>We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.</p>

      <h3><strong>Disclaimer</strong></h3>

      <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:</p>

      <ul>
        <li>limit or exclude our or your liability for death or personal injury;</li>
        <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
        <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
        <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
      </ul>

      <p>The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.</p>

      <p>As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.</p>
    </Wrapper>
  )
}

export default TermsAndConditions
