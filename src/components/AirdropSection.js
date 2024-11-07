import React, { useState } from 'react';

import { useUtils, useHapticFeedback } from '@telegram-apps/sdk-react';
//import { Snackbar, Button } from '@telegram-apps/telegram-ui';
import { Icon28Attach } from '@telegram-apps/telegram-ui/dist/icons/28/attach';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const AirdropSection = ({ inviteUrl }) => {
  const utils = useUtils();
  const hapticFeedback = useHapticFeedback();

  console.log(`[AirdropSection] inviteUrl:`, inviteUrl);
  console.log(`[AirdropSection] utils:`, utils);

  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast',
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  })

  function handleInviteFriend() {

    console.log(`[AirdropSection][handleInviteFriend] inviteUrl:`, inviteUrl);

    utils.shareURL(inviteUrl, "Let fight with Mushroom Warriors together and earn airdrop.");

  }

  function handleCopyInviteUrl() {
    console.log(`[AirdropSection][handleCopyInviteUrl] inviteUrl:`, inviteUrl);
    navigator.clipboard.writeText(inviteUrl);
    hapticFeedback.notificationOccurred('success');

    withReactContent(Toast).fire({
      icon: 'info',
      title: 'Success copy invite url to clipboard.',
    })

  }

  return (
    <>
    <div className="airdrop-section flex flex-col w-full min-h-[380px] -mt-4 bg-cover bg-center" style={{ backgroundImage: "url('/airdrop-bg.png')" }}>
      <div className="flex flex-col justify-center items-center text-white p-4 text-left">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Airdrop</h2>
        <p className="mb-2 text-sm md:text-base">Airdrop event is being planned and will be available to you very soon.</p>
        <p className="mb-2 text-sm md:text-base">Every Mysterious Warrior who protects the forest will have the opportunity to receive Airdrop rewards.</p>
        <p className="mb-4 text-sm md:text-base">Stay tuned for your chance to fight together more!</p>
        <div className='flex flex-row gap-4'>
          <img src={`${process.env.PUBLIC_URL}/invite-your-friend.png`} alt="Invite your friend" className="w-48" onClick={handleInviteFriend} />
          <img src={`${process.env.PUBLIC_URL}/copy-icon.png`} alt="Copy icon" className="w-16 " onClick={handleCopyInviteUrl} />
        </div>
      </div>

    </div>    

    </>
  );
}

export default AirdropSection;